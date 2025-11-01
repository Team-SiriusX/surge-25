import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as z from "zod";
import { db } from "@/lib/db";
import { $Enums } from "@/generated/prisma";
import { currentUser } from "@/lib/current-user";

const app = new Hono()
  // Get all job posts created by current user with optional filters
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        type: z.nativeEnum($Enums.JobType).optional(),
        category: z.nativeEnum($Enums.JobCategory).optional(),
        status: z.nativeEnum($Enums.PostStatus).optional(),
        location: z.string().optional(),
        isDraft: z
          .string()
          .transform((val) => val === "true")
          .optional(),
        isFilled: z
          .string()
          .transform((val) => val === "true")
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
          type,
          category,
          status,
          location,
          isDraft,
          isFilled,
          page = 1,
          limit = 10,
        } = c.req.valid("query");

        const skip = (page - 1) * limit;

        // Always filter by current user's posts
        const where: any = { posterId: user.id };
        if (type) where.type = type;
        if (category) where.category = category;
        if (status) where.status = status;
        if (location)
          where.location = { contains: location, mode: "insensitive" };
        if (isDraft !== undefined) where.isDraft = isDraft;
        if (isFilled !== undefined) where.isFilled = isFilled;

        const [jobs, total] = await Promise.all([
          db.jobPost.findMany({
            where,
            skip,
            take: limit,
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
            orderBy: {
              createdAt: "desc",
            },
          }),
          db.jobPost.count({ where }),
        ]);

        return c.json({
          data: jobs,
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
  // Get job post by ID
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
            applications: {
              include: {
                applicant: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  },
                },
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

        // Increment views count
        await db.jobPost.update({
          where: { id },
          data: { views: { increment: 1 } },
        });

        return c.json({
          data: job,
          message: "Job fetched successfully",
        });
      } catch (error) {
        console.error("Error fetching job:", error);
        return c.json({ message: "Failed to fetch job" }, 500);
      }
    }
  )
  // Create new job post
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        type: z.nativeEnum($Enums.JobType),
        category: z.nativeEnum($Enums.JobCategory),
        tags: z.array(z.string()).default([]),
        location: z.string().optional(),
        duration: z.string().optional(),
        compensation: z.string().optional(),
        requirements: z.array(z.string()).default([]),
        status: z.nativeEnum($Enums.PostStatus).default("ACTIVE"),
        isDraft: z.boolean().default(false),
        expiresAt: z.string().datetime().optional(),
      })
    ),
    async (c) => {
      try {
        // Get current user
        const user = await currentUser();
        if (!user) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        const data = c.req.valid("json");

        const job = await db.jobPost.create({
          data: {
            ...data,
            posterId: user.id, // Use current user's ID
            expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
          },
          include: {
            poster: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        });

        return c.json(
          {
            data: job,
            message: `Job post "${job.title}" created successfully!`,
          },
          201
        );
      } catch (error) {
        console.error("Error creating job:", error);
        return c.json({ message: "Failed to create job post" }, 500);
      }
    }
  )
  // Update job post
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
        title: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        type: z.nativeEnum($Enums.JobType).optional(),
        category: z.nativeEnum($Enums.JobCategory).optional(),
        tags: z.array(z.string()).optional(),
        location: z.string().optional(),
        duration: z.string().optional(),
        compensation: z.string().optional(),
        requirements: z.array(z.string()).optional(),
        status: z.nativeEnum($Enums.PostStatus).optional(),
        isDraft: z.boolean().optional(),
        isFilled: z.boolean().optional(),
        expiresAt: z.string().datetime().optional().nullable(),
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
        const data = c.req.valid("json");

        // Check if job exists
        const existingJob = await db.jobPost.findUnique({
          where: { id },
        });

        if (!existingJob) {
          return c.json({ message: "Job not found" }, 404);
        }

        // Check if the current user is the owner of the job post
        if (existingJob.posterId !== user.id) {
          return c.json(
            { message: "Forbidden: You can only update your own posts" },
            403
          );
        }

        const updatedJob = await db.jobPost.update({
          where: { id },
          data: {
            ...data,
            expiresAt:
              data.expiresAt !== undefined
                ? data.expiresAt
                  ? new Date(data.expiresAt)
                  : null
                : undefined,
          },
          include: {
            poster: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        });

        return c.json({
          data: updatedJob,
          message: "Job post updated successfully",
        });
      } catch (error) {
        console.error("Error updating job:", error);
        return c.json({ message: "Failed to update job post" }, 500);
      }
    }
  )
  // Delete job post
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
        // Get current user
        const user = await currentUser();
        if (!user) {
          return c.json({ message: "Unauthorized" }, 401);
        }

        const { id } = c.req.valid("param");

        // Check if job exists
        const existingJob = await db.jobPost.findUnique({
          where: { id },
        });

        if (!existingJob) {
          return c.json({ message: "Job not found" }, 404);
        }

        // Check if the current user is the owner of the job post
        if (existingJob.posterId !== user.id) {
          return c.json(
            { message: "Forbidden: You can only delete your own posts" },
            403
          );
        }

        await db.jobPost.delete({
          where: { id },
        });

        return c.json({
          message: `Job post with id ${id} deleted successfully`,
        });
      } catch (error) {
        console.error("Error deleting job:", error);
        return c.json({ message: "Failed to delete job post" }, 500);
      }
    }
  );

export default app;
