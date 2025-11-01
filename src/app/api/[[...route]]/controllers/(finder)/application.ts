import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { db } from "@/lib/db";
import { $Enums } from "@/generated/prisma";
import { currentUser } from "@/lib/current-user";

const app = new Hono()
  // Get all applications for job posts created by current user with optional filters
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        status: z.nativeEnum($Enums.ApplicationStatus).optional(),
        applicantId: z.string().optional(),
        jobPostId: z.string().optional(),
        minMatchScore: z
          .string()
          .transform((val) => parseInt(val))
          .optional(),
        maxMatchScore: z
          .string()
          .transform((val) => parseInt(val))
          .optional(),
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
        // Get current user
        const user = await currentUser();
        if (!user) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        const {
          status,
          applicantId,
          jobPostId,
          minMatchScore,
          maxMatchScore,
          page = 1,
          limit = 10,
        } = c.req.valid("query");

        const skip = (page - 1) * limit;

        // Build where clause - only applications for job posts created by current user
        const where: any = {
          jobPost: {
            posterId: user.id,
          },
        };
        if (status) where.status = status;
        if (applicantId) where.applicantId = applicantId;
        if (jobPostId) where.jobPostId = jobPostId;

        if (minMatchScore !== undefined || maxMatchScore !== undefined) {
          where.matchScore = {};
          if (minMatchScore !== undefined) where.matchScore.gte = minMatchScore;
          if (maxMatchScore !== undefined) where.matchScore.lte = maxMatchScore;
        }

        const [applications, total] = await Promise.all([
          db.application.findMany({
            where,
            skip,
            take: limit,
            include: {
              applicant: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                  bio: true,
                  skills: true,
                  university: true,
                  major: true,
                  graduationYear: true,
                  linkedIn: true,
                  github: true,
                  portfolio: true,
                  resume: true,
                },
              },
              jobPost: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                  category: true,
                  location: true,
                  status: true,
                  poster: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      image: true,
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
  // Get application by ID
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
        // Get current user
        const user = await currentUser();
        if (!user) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        const { id } = c.req.valid("param");

        const application = await db.application.findUnique({
          where: { id },
          include: {
            applicant: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                bio: true,
                skills: true,
                interests: true,
                university: true,
                major: true,
                graduationYear: true,
                linkedIn: true,
                github: true,
                portfolio: true,
                resume: true,
                phone: true,
              },
            },
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
                  },
                },
              },
            },
          },
        });

        if (!application) {
          return c.json({ message: "Application not found" }, 404);
        }

        // Check if the current user is the owner of the job post
        if (application.jobPost.posterId !== user.id) {
          return c.json(
            {
              message:
                "Forbidden: You can only view applications for your own job posts",
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
