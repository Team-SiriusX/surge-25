import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

// Custom URL validator that allows empty strings
const optionalUrl = z
  .string()
  .optional()
  .refine(
    (val) => !val || val === "" || z.string().url().safeParse(val).success,
    { message: "Invalid URL format. Please use format: https://example.com" }
  )
  .transform((val) => (val === "" ? null : val));

const app = new Hono()
  // Get current user profile
  .get("/me", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        bio: true,
        skills: true,
        interests: true,
        resume: true,
        phone: true,
        linkedIn: true,
        github: true,
        portfolio: true,
        university: true,
        major: true,
        graduationYear: true,
        profileScore: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user });
  })

  // Get user profile by ID
  .get("/:id", async (c) => {
    const userId = c.req.param("id");

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        skills: true,
        interests: true,
        linkedIn: true,
        github: true,
        portfolio: true,
        university: true,
        major: true,
        graduationYear: true,
        createdAt: true,
      },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ user });
  })

  // Update profile
  .patch(
    "/",
    zValidator(
      "json",
      z.object({
        name: z.string().min(2).optional(),
        bio: z.string().max(500).optional(),
        skills: z.array(z.string()).optional(),
        interests: z.array(z.string()).optional(),
        phone: z.string().optional(),
        linkedIn: optionalUrl,
        github: optionalUrl,
        portfolio: optionalUrl,
        university: z.string().optional(),
        major: z.string().optional(),
        graduationYear: z.number().int().min(2020).max(2050).optional(),
      }),
      (result, c) => {
        if (!result.success) {
          const errors = result.error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`);
          return c.json({ 
            error: errors.length === 1 ? errors[0] : errors.join(', ') 
          }, 400);
        }
      }
    ),
    async (c) => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });

      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = c.req.valid("json");

      // Calculate profile score
      const profileScore = calculateProfileScore({
        ...data,
        email: session.user.email,
        image: session.user.image,
      });

      const updatedUser = await db.user.update({
        where: { id: session.user.id },
        data: {
          ...data,
          profileScore,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          skills: true,
          interests: true,
          phone: true,
          linkedIn: true,
          github: true,
          portfolio: true,
          university: true,
          major: true,
          graduationYear: true,
          profileScore: true,
        },
      });

      return c.json({ user: updatedUser, message: "Profile updated successfully" });
    }
  )

  // Update avatar
  .patch(
    "/avatar",
    zValidator(
      "json",
      z.object({
        image: z.string().min(1, "Image URL is required"),
      })
    ),
    async (c) => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });

      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { image } = c.req.valid("json");

      const updatedUser = await db.user.update({
        where: { id: session.user.id },
        data: { image },
        select: {
          id: true,
          image: true,
        },
      });

      return c.json({ user: updatedUser, message: "Avatar updated successfully" });
    }
  )

  // Update resume
  .patch(
    "/resume",
    zValidator(
      "json",
      z.object({
        resume: z.string().min(1, "Resume URL is required"),
      })
    ),
    async (c) => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });

      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { resume } = c.req.valid("json");

      const updatedUser = await db.user.update({
        where: { id: session.user.id },
        data: { resume },
        select: {
          id: true,
          resume: true,
        },
      });

      return c.json({ user: updatedUser, message: "Resume updated successfully" });
    }
  );

// Helper function to calculate profile completeness score
function calculateProfileScore(profile: any): number {
  let score = 0;
  const fields = {
    email: 10,
    name: 10,
    image: 10,
    bio: 15,
    phone: 5,
    skills: 15,
    interests: 10,
    linkedIn: 5,
    github: 5,
    portfolio: 5,
    university: 5,
    major: 5,
    graduationYear: 5,
  };

  for (const [field, points] of Object.entries(fields)) {
    const value = profile[field];
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        if (value.length > 0) score += points;
      } else {
        score += points;
      }
    }
  }

  return Math.min(score, 100);
}

export { app as profile };
