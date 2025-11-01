import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { db } from "@/lib/db";
import { $Enums } from "@/generated/prisma";

const app = new Hono()
  // Get all applications with optional filters
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        status: z.nativeEnum($Enums.ApplicationStatus).optional(),
        applicantId: z.string().optional(),
        jobPostId: z.string().optional(),
        minMatchScore: z.string().transform((val) => parseInt(val)).optional(),
        maxMatchScore: z.string().transform((val) => parseInt(val)).optional(),
        page: z.string().transform((val) => parseInt(val) || 1).optional(),
        limit: z.string().transform((val) => parseInt(val) || 10).optional(),
      })
    ),
    async (c) => {
      try {
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

        const where: any = {};
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

        return c.json({
          data: application,
          message: "Application fetched successfully",
        });
      } catch (error) {
        console.error("Error fetching application:", error);
        return c.json({ message: "Failed to fetch application" }, 500);
      }
    }
  )
  // Create new application
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        coverLetter: z.string().optional(),
        resumeUrl: z.string().url().optional(),
        customMessage: z.string().optional(),
        matchScore: z.number().min(0).max(100).optional(),
        jobPostId: z.string().min(1, "Job Post ID is required"),
        applicantId: z.string().min(1, "Applicant ID is required"),
      })
    ),
    async (c) => {
      try {
        const data = c.req.valid("json");

        // Check if job post exists
        const jobPost = await db.jobPost.findUnique({
          where: { id: data.jobPostId },
          select: { id: true, title: true, isFilled: true, status: true },
        });

        if (!jobPost) {
          return c.json({ message: "Job post not found" }, 404);
        }

        if (jobPost.isFilled) {
          return c.json({ message: "This job position is already filled" }, 400);
        }

        if (jobPost.status !== "ACTIVE") {
          return c.json({ message: "This job post is not active" }, 400);
        }

        // Check if user already applied
        const existingApplication = await db.application.findUnique({
          where: {
            jobPostId_applicantId: {
              jobPostId: data.jobPostId,
              applicantId: data.applicantId,
            },
          },
        });

        if (existingApplication) {
          return c.json(
            { message: "You have already applied to this job" },
            409
          );
        }

        // Create application and increment applications count
        const [application] = await Promise.all([
          db.application.create({
            data,
            include: {
              applicant: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
              jobPost: {
                select: {
                  id: true,
                  title: true,
                  type: true,
                  category: true,
                },
              },
            },
          }),
          db.jobPost.update({
            where: { id: data.jobPostId },
            data: { applicationsCount: { increment: 1 } },
          }),
        ]);

        return c.json(
          {
            data: application,
            message: `Application to "${jobPost.title}" submitted successfully!`,
          },
          201
        );
      } catch (error) {
        console.error("Error creating application:", error);
        return c.json({ message: "Failed to create application" }, 500);
      }
    }
  )
  // Update application
  .patch(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    zValidator(
      "json",
      z.object({
        coverLetter: z.string().optional(),
        resumeUrl: z.string().url().optional(),
        customMessage: z.string().optional(),
        status: z.nativeEnum($Enums.ApplicationStatus).optional(),
        matchScore: z.number().min(0).max(100).optional().nullable(),
      })
    ),
    async (c) => {
      try {
        const { id } = c.req.valid("param");
        const data = c.req.valid("json");

        // Check if application exists
        const existingApplication = await db.application.findUnique({
          where: { id },
        });

        if (!existingApplication) {
          return c.json({ message: "Application not found" }, 404);
        }

        const updatedApplication = await db.application.update({
          where: { id },
          data,
          include: {
            applicant: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
            jobPost: {
              select: {
                id: true,
                title: true,
                type: true,
                category: true,
              },
            },
          },
        });

        return c.json({
          data: updatedApplication,
          message: "Application updated successfully",
        });
      } catch (error) {
        console.error("Error updating application:", error);
        return c.json({ message: "Failed to update application" }, 500);
      }
    }
  )
  // Delete application
  .delete(
    "/:id",
    zValidator(
      "param",
      z.object({
        id: z.string(),
      })
    ),
    async (c) => {
      try {
        const { id } = c.req.valid("param");

        // Check if application exists
        const existingApplication = await db.application.findUnique({
          where: { id },
          select: { id: true, jobPostId: true },
        });

        if (!existingApplication) {
          return c.json({ message: "Application not found" }, 404);
        }

        // Delete application and decrement applications count
        await Promise.all([
          db.application.delete({
            where: { id },
          }),
          db.jobPost.update({
            where: { id: existingApplication.jobPostId },
            data: { applicationsCount: { decrement: 1 } },
          }),
        ]);

        return c.json({
          message: `Application with id ${id} deleted successfully`,
        });
      } catch (error) {
        console.error("Error deleting application:", error);
        return c.json({ message: "Failed to delete application" }, 500);
      }
    }
  );

export default app;
