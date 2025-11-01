import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { db } from "@/lib/db";
import { $Enums } from "@/generated/prisma";
import { currentUser } from "@/lib/current-user";

/**
 * Calculate match score between a job post and applicant profile
 * Same scoring system as job.ts for consistency
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

  const normalizeArray = (arr: string[]) =>
    arr.map((s) => s.toLowerCase().trim());
  const normalizeString = (s: string) => s.toLowerCase().trim();

  const userSkills = normalizeArray(user.skills);
  const userInterests = normalizeArray(user.interests);
  const jobTags = normalizeArray(job.tags);
  const jobRequirements = normalizeArray(job.requirements);

  // Skills Match (40 points)
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

  // Major/Category Alignment (30 points)
  if (user.major) {
    const normalizedMajor = normalizeString(user.major);
    const categoryMajorMapping: { [key: string]: string[] } = {
      DEVELOPMENT: ["computer science", "software engineering", "information technology", "it", "cs"],
      DESIGN: ["design", "graphic design", "ui/ux", "visual arts", "fine arts"],
      MARKETING: ["marketing", "business", "communications", "advertising"],
      DATA_SCIENCE: ["data science", "statistics", "mathematics", "analytics"],
      RESEARCH: ["research", "science", "engineering", "physics", "biology", "chemistry"],
      BUSINESS_DEVELOPMENT: ["business", "management", "entrepreneurship", "mba"],
      FINANCE: ["finance", "accounting", "economics"],
      CONTENT_WRITING: ["english", "journalism", "communications", "writing", "media"],
      PRODUCT_MANAGEMENT: ["product management", "business", "management"],
    };

    const relevantMajors = categoryMajorMapping[job.category] || [];
    const isMajorRelevant = relevantMajors.some(
      (major) => normalizedMajor.includes(major) || major.includes(normalizedMajor)
    );

    if (isMajorRelevant) {
      score += 30;
    } else {
      const majorInTags = jobTags.some(
        (tag) => normalizedMajor.includes(tag) || tag.includes(normalizedMajor)
      );
      if (majorInTags) {
        score += 15;
      }
    }
  }

  // Interests Match (30 points)
  if (userInterests.length > 0 && (jobTags.length > 0 || jobRequirements.length > 0)) {
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

  return Math.min(Math.max(score, 0), 100);
}

const app = new Hono()
  // Get all applications submitted by current user
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        status: z.nativeEnum($Enums.ApplicationStatus).optional(),
        jobPostId: z.string().optional(),
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
        const user = await currentUser();
        if (!user) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        const { status, jobPostId, page = 1, limit = 10 } = c.req.valid("query");
        const skip = (page - 1) * limit;

        // Build where clause - only applications by current user
        const where: any = {
          applicantId: user.id,
        };
        if (status) where.status = status;
        if (jobPostId) where.jobPostId = jobPostId;

        const [applications, total] = await Promise.all([
          db.application.findMany({
            where,
            skip,
            take: limit,
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
                    },
                  },
                },
              },
            },
            orderBy: {
              appliedAt: "desc",
            },
          }),
          db.application.count({ where }),
        ]);

        return c.json({
          data: applications,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
          message: "Applications fetched successfully",
        });
      } catch (error) {
        console.error("Error fetching applications:", error);
        return c.json({ message: "Failed to fetch applications" }, 500);
      }
    }
  )
  // Get single application by ID
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
        const user = await currentUser();
        if (!user) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        const { id } = c.req.valid("param");

        const application = await db.application.findUnique({
          where: { id },
          include: {
            jobPost: {
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
            },
          },
        });

        if (!application) {
          return c.json({ message: "Application not found" }, 404);
        }

        // Check if the current user is the applicant
        if (application.applicantId !== user.id) {
          return c.json(
            {
              message: "Forbidden: You can only view your own applications",
            },
            403
          );
        }

        return c.json({
          data: application,
          message: "Application fetched successfully",
        });
      } catch (error) {
        console.error("Error fetching application:", error);
        return c.json({ message: "Failed to fetch application" }, 500);
      }
    }
  );

export default app;
