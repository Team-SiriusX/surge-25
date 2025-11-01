import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { db } from "@/lib/db";
import { $Enums } from "@/generated/prisma";
import { currentUser } from "@/lib/current-user";

/**
 * Calculate match score between a job post and user profile
 * Scoring breakdown:
 * - Skills match: 40 points (max)
 * - Major/Category alignment: 30 points (max)
 * - Interests match: 30 points (max)
 * Total: 100 points
 */
function calculateMatchScore(
  job: {
    category: $Enums.JobCategory;
    tags: string[];
    requirements: string[];
  },
  user: {
    skills: string[];
    interests: string[];
    major: string | null;
  }
): number {
  let score = 0;

  // Normalize strings for comparison (lowercase, trim)
  const normalizeArray = (arr: string[]) =>
    arr.map((s) => s.toLowerCase().trim());
  const normalizeString = (s: string) => s.toLowerCase().trim();

  const userSkills = normalizeArray(user.skills);
  const userInterests = normalizeArray(user.interests);
  const jobTags = normalizeArray(job.tags);
  const jobRequirements = normalizeArray(job.requirements);

  // 1. Skills Match (40 points max)
  // Check if user skills match job requirements or tags
  const combinedJobSkills = [...jobRequirements, ...jobTags];
  if (combinedJobSkills.length > 0 && userSkills.length > 0) {
    const matchingSkills = userSkills.filter((skill) =>
      combinedJobSkills.some(
        (jobSkill) => jobSkill.includes(skill) || skill.includes(jobSkill)
      )
    );
    const skillMatchRatio =
      matchingSkills.length /
      Math.max(combinedJobSkills.length, userSkills.length);
    score += Math.round(skillMatchRatio * 40);
  }

  // 2. Major/Category Alignment (30 points max)
  // Map common majors to job categories
  if (user.major) {
    const normalizedMajor = normalizeString(user.major);
    const categoryMajorMapping: { [key: string]: string[] } = {
      DEVELOPMENT: [
        "computer science",
        "software engineering",
        "information technology",
        "it",
        "cs",
      ],
      DESIGN: ["design", "graphic design", "ui/ux", "visual arts", "fine arts"],
      MARKETING: ["marketing", "business", "communications", "advertising"],
      DATA_SCIENCE: ["data science", "statistics", "mathematics", "analytics"],
      RESEARCH: [
        "research",
        "science",
        "engineering",
        "physics",
        "biology",
        "chemistry",
      ],
      BUSINESS_DEVELOPMENT: [
        "business",
        "management",
        "entrepreneurship",
        "mba",
      ],
      FINANCE: ["finance", "accounting", "economics"],
      CONTENT_WRITING: [
        "english",
        "journalism",
        "communications",
        "writing",
        "media",
      ],
      PRODUCT_MANAGEMENT: ["product management", "business", "management"],
    };

    const relevantMajors = categoryMajorMapping[job.category] || [];
    const isMajorRelevant = relevantMajors.some(
      (major) =>
        normalizedMajor.includes(major) || major.includes(normalizedMajor)
    );

    if (isMajorRelevant) {
      score += 30;
    } else {
      // Partial credit if major is mentioned in tags
      const majorInTags = jobTags.some(
        (tag) => normalizedMajor.includes(tag) || tag.includes(normalizedMajor)
      );
      if (majorInTags) {
        score += 15;
      }
    }
  }

  // 3. Interests Match (30 points max)
  // Check if user interests align with job tags or requirements
  if (
    userInterests.length > 0 &&
    (jobTags.length > 0 || jobRequirements.length > 0)
  ) {
    const combinedJobKeywords = [...jobTags, ...jobRequirements];
    const matchingInterests = userInterests.filter((interest) =>
      combinedJobKeywords.some(
        (keyword) => keyword.includes(interest) || interest.includes(keyword)
      )
    );
    const interestMatchRatio =
      matchingInterests.length /
      Math.max(combinedJobKeywords.length, userInterests.length);
    score += Math.round(interestMatchRatio * 30);
  }

  // Ensure score is between 0 and 100
  return Math.min(Math.max(score, 0), 100);
}

const app = new Hono()
  // Get all job posts with match scores and optional search for current user
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        q: z.string().optional(), // Search query
        type: z.nativeEnum($Enums.JobType).optional(),
        category: z.nativeEnum($Enums.JobCategory).optional(),
        location: z.string().optional(),
        tags: z.string().optional(), // Comma-separated tags
        minMatchScore: z
          .string()
          .transform((val) => parseInt(val))
          .optional(),
        sortBy: z
          .enum(["matchScore", "createdAt", "views", "relevance"])
          .default("matchScore"),
        page: z
          .string()
          .transform((val) => parseInt(val) || 1)
          .optional(),
        limit: z
          .string()
          .transform((val) => parseInt(val) || 10)
          .optional(),
      })
    ),
    async (c) => {
      try {
        // Get current user from session
        const sessionUser = await currentUser();
        if (!sessionUser) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        // Fetch full user profile from database
        const user = await db.user.findUnique({
          where: { id: sessionUser.id },
          select: {
            id: true,
            skills: true,
            interests: true,
            major: true,
          },
        });

        if (!user) {
          return c.json({ message: "User not found" }, 404);
        }

        const {
          q: searchQuery,
          type,
          category,
          location,
          tags,
          minMatchScore,
          sortBy = "matchScore",
          page = 1,
          limit = 10,
        } = c.req.valid("query");

        // Build where clause (exclude user's own posts and only active posts)
        const where: any = {
          posterId: { not: user.id },
          status: "ACTIVE",
          isDraft: false,
          isFilled: false,
        };

        if (type) where.type = type;
        if (category) where.category = category;
        if (location)
          where.location = { contains: location, mode: "insensitive" };
        if (tags) {
          const tagArray = tags.split(",").map((t) => t.trim());
          where.tags = { hasSome: tagArray };
        }

        // Add search functionality
        if (searchQuery && searchQuery.trim()) {
          where.OR = [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
            { tags: { hasSome: [searchQuery.toLowerCase()] } },
            { requirements: { hasSome: [searchQuery.toLowerCase()] } },
          ];
        }

        // Get all matching jobs (we'll filter by match score after calculation)
        const allJobs = await db.jobPost.findMany({
          where,
          include: {
            poster: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                university: true,
              },
            },
            _count: {
              select: {
                applications: true,
                savedBy: true,
              },
            },
          },
        });

        // Get all saved job IDs for current user
        const savedJobIds = await db.savedJob.findMany({
          where: { userId: user.id },
          select: { jobPostId: true },
        });
        const savedJobIdsSet = new Set(savedJobIds.map((sj) => sj.jobPostId));

        // Calculate match scores and relevance scores for each job
        const jobsWithScores = allJobs.map((job) => {
          const matchScore = calculateMatchScore(
            {
              category: job.category,
              tags: job.tags,
              requirements: job.requirements,
            },
            {
              skills: user.skills,
              interests: user.interests,
              major: user.major,
            }
          );

          // Calculate relevance score if there's a search query
          let relevanceScore = 0;
          if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            // Title match: 50 points
            if (job.title.toLowerCase().includes(query)) relevanceScore += 50;
            // Description match: 20 points
            if (job.description.toLowerCase().includes(query))
              relevanceScore += 20;
            // Tag match: 15 points per tag
            const tagMatches = job.tags.filter((tag) =>
              tag.toLowerCase().includes(query)
            );
            relevanceScore += tagMatches.length * 15;
            // Requirement match: 10 points per requirement
            const reqMatches = job.requirements.filter((req) =>
              req.toLowerCase().includes(query)
            );
            relevanceScore += reqMatches.length * 10;
          }

          return {
            ...job,
            matchScore,
            relevanceScore,
            hasSaved: savedJobIdsSet.has(job.id),
          };
        });

        // Filter by minimum match score if provided
        let filteredJobs = jobsWithScores;
        if (minMatchScore !== undefined) {
          filteredJobs = jobsWithScores.filter(
            (job) => job.matchScore >= minMatchScore
          );
        }

        // Sort jobs
        filteredJobs.sort((a, b) => {
          if (sortBy === "matchScore") {
            return b.matchScore - a.matchScore;
          } else if (sortBy === "createdAt") {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          } else if (sortBy === "views") {
            return b.views - a.views;
          } else if (sortBy === "relevance" && searchQuery) {
            // Sort by relevance first, then match score
            if (b.relevanceScore !== a.relevanceScore) {
              return b.relevanceScore - a.relevanceScore;
            }
            return b.matchScore - a.matchScore;
          }
          return 0;
        });

        // Paginate
        const total = filteredJobs.length;
        const skip = (page - 1) * limit;
        const paginatedJobs = filteredJobs.slice(skip, skip + limit);

        return c.json({
          data: paginatedJobs,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
          message: "Jobs fetched successfully",
        });
      } catch (error) {
        console.error("Error fetching jobs:", error);
        return c.json({ message: "Failed to fetch jobs" }, 500);
      }
    }
  )
  // Get job post by ID with match score
  .get(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      try {
        // Get current user from session
        const sessionUser = await currentUser();
        if (!sessionUser) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        // Fetch full user profile from database
        const user = await db.user.findUnique({
          where: { id: sessionUser.id },
          select: {
            id: true,
            skills: true,
            interests: true,
            major: true,
          },
        });

        if (!user) {
          return c.json({ message: "User not found" }, 404);
        }

        const { id } = c.req.valid("param");

        const job = await db.jobPost.findUnique({
          where: { id },
          include: {
            poster: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                university: true,
                linkedIn: true,
                github: true,
                portfolio: true,
              },
            },
            _count: {
              select: {
                applications: true,
                savedBy: true,
              },
            },
          },
        });

        if (!job) {
          return c.json({ message: "Job not found" }, 404);
        }

        // Calculate match score for this job
        const matchScore = calculateMatchScore(
          {
            category: job.category,
            tags: job.tags,
            requirements: job.requirements,
          },
          {
            skills: user.skills,
            interests: user.interests,
            major: user.major,
          }
        );

        // Increment views count
        await db.jobPost.update({
          where: { id },
          data: { views: { increment: 1 } },
        });

        // Check if user has already applied
        const hasApplied = await db.application.findUnique({
          where: {
            jobPostId_applicantId: {
              jobPostId: id,
              applicantId: user.id,
            },
          },
        });

        // Check if user has saved this job
        const hasSaved = await db.savedJob.findUnique({
          where: {
            userId_jobPostId: {
              userId: user.id,
              jobPostId: id,
            },
          },
        });

        return c.json({
          data: {
            ...job,
            matchScore,
            hasApplied: !!hasApplied,
            hasSaved: !!hasSaved,
          },
          message: "Job fetched successfully",
        });
      } catch (error) {
        console.error("Error fetching job:", error);
        return c.json({ message: "Failed to fetch job" }, 500);
      }
    }
  )
  // Save a job post
  .post(
    "/:id/save",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      try {
        // Get current user from session
        const sessionUser = await currentUser();
        if (!sessionUser) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        const { id } = c.req.valid("param");

        // Check if job exists
        const job = await db.jobPost.findUnique({
          where: { id },
        });

        if (!job) {
          return c.json({ message: "Job not found" }, 404);
        }

        // Check if already saved
        const existingSave = await db.savedJob.findUnique({
          where: {
            userId_jobPostId: {
              userId: sessionUser.id,
              jobPostId: id,
            },
          },
        });

        if (existingSave) {
          return c.json({ message: "Job already saved" }, 400);
        }

        // Save the job
        const savedJob = await db.savedJob.create({
          data: {
            userId: sessionUser.id,
            jobPostId: id,
          },
        });

        return c.json({
          data: savedJob,
          message: "Job saved successfully",
        });
      } catch (error) {
        console.error("Error saving job:", error);
        return c.json({ message: "Failed to save job" }, 500);
      }
    }
  )
  // Unsave a job post
  .delete(
    "/:id/save",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      try {
        // Get current user from session
        const sessionUser = await currentUser();
        if (!sessionUser) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        const { id } = c.req.valid("param");

        // Check if saved
        const existingSave = await db.savedJob.findUnique({
          where: {
            userId_jobPostId: {
              userId: sessionUser.id,
              jobPostId: id,
            },
          },
        });

        if (!existingSave) {
          return c.json({ message: "Job not saved" }, 404);
        }

        // Remove the saved job
        await db.savedJob.delete({
          where: {
            userId_jobPostId: {
              userId: sessionUser.id,
              jobPostId: id,
            },
          },
        });

        return c.json({
          message: "Job unsaved successfully",
        });
      } catch (error) {
        console.error("Error unsaving job:", error);
        return c.json({ message: "Failed to unsave job" }, 500);
      }
    }
  )
  // Get all saved jobs for current user
  .get("/saved/list", async (c) => {
    try {
      // Get current user from session
      const sessionUser = await currentUser();
      if (!sessionUser) {
        return c.json({ message: "Unauthorized" }, 401);
      }

      // Fetch full user profile from database
      const user = await db.user.findUnique({
        where: { id: sessionUser.id },
        select: {
          id: true,
          skills: true,
          interests: true,
          major: true,
        },
      });

      if (!user) {
        return c.json({ message: "User not found" }, 404);
      }

      // Get all saved jobs with job details
      const savedJobs = await db.savedJob.findMany({
        where: { userId: user.id },
        include: {
          jobPost: {
            include: {
              poster: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  university: true,
                },
              },
              _count: {
                select: {
                  applications: true,
                  savedBy: true,
                },
              },
            },
          },
        },
        orderBy: {
          savedAt: "desc",
        },
      });

      // Calculate match scores for saved jobs
      const jobsWithScores = savedJobs.map((saved) => {
        const matchScore = calculateMatchScore(
          {
            category: saved.jobPost.category,
            tags: saved.jobPost.tags,
            requirements: saved.jobPost.requirements,
          },
          {
            skills: user.skills,
            interests: user.interests,
            major: user.major,
          }
        );

        return {
          ...saved,
          jobPost: {
            ...saved.jobPost,
            matchScore,
          },
        };
      });

      return c.json({
        data: jobsWithScores,
        message: "Saved jobs fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
      return c.json({ message: "Failed to fetch saved jobs" }, 500);
    }
  })
  // Submit application for a job
  .post(
    "/:id/apply",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    zValidator(
      "json",
      z.object({
        coverLetter: z
          .string()
          .min(50, "Cover letter must be at least 50 characters")
          .max(2000, "Cover letter must not exceed 2000 characters")
          .optional(),
        resumeUrl: z.string().url("Invalid resume URL").optional(),
        customMessage: z
          .string()
          .max(1000, "Custom message must not exceed 1000 characters")
          .optional(),
      })
    ),
    async (c) => {
      try {
        const sessionUser = await currentUser();
        if (!sessionUser) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        const { id: jobPostId } = c.req.valid("param");
        const applicationData = c.req.valid("json");

        // Fetch full user profile
        const user = await db.user.findUnique({
          where: { id: sessionUser.id },
          select: {
            id: true,
            skills: true,
            interests: true,
            major: true,
            name: true,
            email: true,
          },
        });

        if (!user) {
          return c.json({ message: "User not found" }, 404);
        }

        // Check if job exists
        const job = await db.jobPost.findUnique({
          where: { id: jobPostId },
          include: {
            poster: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });

        if (!job) {
          return c.json({ message: "Job not found" }, 404);
        }

        // Check if user is trying to apply to their own job
        if (job.posterId === user.id) {
          return c.json(
            { message: "You cannot apply to your own job post" },
            400
          );
        }

        // Check if already applied
        const existingApplication = await db.application.findUnique({
          where: {
            jobPostId_applicantId: {
              jobPostId,
              applicantId: user.id,
            },
          },
        });

        if (existingApplication) {
          return c.json(
            { message: "You have already applied to this job" },
            400
          );
        }

        // Calculate match score
        const matchScore = calculateMatchScore(
          {
            category: job.category,
            tags: job.tags,
            requirements: job.requirements,
          },
          {
            skills: user.skills,
            interests: user.interests,
            major: user.major,
          }
        );

        // Create application with the new schema
        const application = await db.application.create({
          data: {
            jobPostId,
            applicantId: user.id,
            coverLetter: applicationData.coverLetter || null,
            resumeUrl: applicationData.resumeUrl || null,
            customMessage: applicationData.customMessage || null,
            matchScore,
            status: "PENDING",
          },
        });

        // Create notification for job poster
        await db.notification.create({
          data: {
            userId: job.posterId,
            type: "APPLICATION_RECEIVED",
            title: "New Application Received",
            message: `${user.name || "A student"} applied for "${job.title}"`,
            link: `/finder/applications/${application.id}`,
            metadata: {
              applicationId: application.id,
              jobPostId,
              applicantId: user.id,
            },
          },
        });

        return c.json({
          data: application,
          message: "Application submitted successfully",
        });
      } catch (error) {
        console.error("Error submitting application:", error);
        return c.json({ message: "Failed to submit application" }, 500);
      }
    }
  );

export default app;
