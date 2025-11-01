import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { GEMINI_CHAT_MODEL, GEMINI_CHAT_MODEL_CANDIDATES, streamGeminiChat } from "@/lib/ai/gemini-stream";
import { streamText } from "hono/streaming";

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
  )

  .post(
    "/chat",
    zValidator(
      "json",
      z.object({
        messages: z.array(
          z.object({
            role: z.enum(["user", "assistant"]),
            content: z.string(),
          })
        ),
      })
    ),
    async (c) => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const me = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
          name: true,
          bio: true,
          skills: true,
          interests: true,
          resume: true,
          linkedIn: true,
          github: true,
          portfolio: true,
          university: true,
          major: true,
          graduationYear: true,
        },
      });

      if (!me) {
        return c.json({ error: "User not found" }, 404);
      }

      const { messages } = c.req.valid("json");

      const sanitize = (s?: string | null) =>
        (s || "")
          .replace(/\b[\w.-]+@[\w.-]+\.\w+\b/g, "[redacted]")
          .replace(/\+?\d[\d\s-]{7,}\b/g, "[redacted]");

      const skillsStr = Array.isArray(me.skills)
        ? me.skills.join(", ")
        : (me.skills as unknown as string) || "";
      const interestsStr = Array.isArray(me.interests)
        ? me.interests.join(", ")
        : (me.interests as unknown as string) || "";

      const systemInstruction = `You are an expert career advisor for a campus job marketplace called UniConnect.

STUDENT PROFILE (PII sanitized):
- Name: ${sanitize(me.name)}
- Bio: ${sanitize(me.bio)}
- Skills: ${sanitize(skillsStr)}
- Interests: ${sanitize(interestsStr)}
- Education: ${sanitize(me.major)} at ${sanitize(me.university)} (${me.graduationYear || "—"})
- Links:
  - GitHub: ${sanitize(me.github)}
  - LinkedIn: ${sanitize(me.linkedIn)}
  - Portfolio: ${sanitize(me.portfolio)}
  - Resume: ${sanitize(me.resume)}

YOUR ROLE:
- Provide actionable, personalized career and profile advice
- Be conversational, friendly, and encouraging
- Ask clarifying questions when needed
- Give specific, implementable suggestions
- Focus on what the student can improve on their profile
- Keep responses concise but insightful (2-4 paragraphs max)
- Use markdown formatting for better readability

GUIDELINES:
- Only suggest changes they can make on their profile page
- Be constructive and positive
- Prioritize high-impact improvements
- Tailor advice to their field of study and interests`;

      try {
        const candidates = [GEMINI_CHAT_MODEL, ...GEMINI_CHAT_MODEL_CANDIDATES];
        let lastError: unknown = null;

        for (const modelName of candidates) {
          try {
            const geminiStream = await streamGeminiChat({
              model: modelName,
              messages,
              systemInstruction,
            });

            return streamText(c, async (stream) => {
              const reader = geminiStream.getReader();
              const decoder = new TextDecoder();

              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  await stream.write(decoder.decode(value, { stream: true }));
                }
              } catch (e) {
                console.error("[chat] stream error", e);
              }
            });
          } catch (e: any) {
            lastError = e;
            const status = e?.status;
            const msg: string = e?.message || "";
            const notFound = status === 404 || /not found|unsupported/i.test(msg);
            console.warn(`[chat] model failed: ${modelName} (status: ${status}) ${msg}`);
            if (!notFound) {
              break;
            }
            continue;
          }
        }

        console.error("/profile/chat error (all models failed)", lastError);
        const message =
          typeof (lastError as any)?.message === "string"
            ? (lastError as any).message
            : "AI chat unavailable. Please try again later.";
        return c.json({ error: message }, 502);
      } catch (err) {
        console.error("/profile/chat error", err);
        return c.json({ error: "Unable to process chat" }, 500);
      }
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
