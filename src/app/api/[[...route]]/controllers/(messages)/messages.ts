import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";

const app = new Hono()
  // Get all conversations for the current user
  .get("/conversations", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1, // Get last message
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        jobPost: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return c.json({ conversations });
  })

  // Get a specific conversation with all messages
  .get("/:conversationId", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const conversationId = c.req.param("conversationId");

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
                role: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            receiver: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        jobPost: {
          select: {
            id: true,
            title: true,
            type: true,
            description: true,
          },
        },
      },
    });

    if (!conversation) {
      return c.json({ error: "Conversation not found" }, 404);
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.userId === session.user.id
    );

    if (!isParticipant) {
      return c.json({ error: "Not authorized to view this conversation" }, 403);
    }

    // Mark messages as read
    await db.message.updateMany({
      where: {
        conversationId,
        receiverId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    // Update last read timestamp
    await db.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId: session.user.id,
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return c.json({ conversation });
  })

  // Create or get a conversation (for finder to message applicant)
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        receiverId: z.string(),
        jobPostId: z.string().optional(),
      })
    ),
    async (c) => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });

      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { receiverId, jobPostId } = c.req.valid("json");

      // Check if conversation already exists
      const existingConversation = await db.conversation.findFirst({
        where: {
          AND: [
            {
              participants: {
                some: {
                  userId: session.user.id,
                },
              },
            },
            {
              participants: {
                some: {
                  userId: receiverId,
                },
              },
            },
            jobPostId ? { jobPostId } : {},
          ],
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  email: true,
                },
              },
            },
          },
          jobPost: {
            select: {
              id: true,
              title: true,
              type: true,
            },
          },
        },
      });

      if (existingConversation) {
        return c.json({ conversation: existingConversation });
      }

      // Create new conversation
      const conversation = await db.conversation.create({
        data: {
          jobPostId,
          participants: {
            create: [
              { userId: session.user.id },
              { userId: receiverId },
            ],
          },
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  email: true,
                },
              },
            },
          },
          jobPost: {
            select: {
              id: true,
              title: true,
              type: true,
            },
          },
        },
      });

      return c.json({ conversation });
    }
  )

  // Send a message
  .post(
    "/:conversationId/messages",
    zValidator(
      "json",
      z.object({
        content: z.string().min(1),
      })
    ),
    async (c) => {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });

      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const conversationId = c.req.param("conversationId");
      const { content } = c.req.valid("json");

      // Get conversation and verify user is a participant
      const conversation = await db.conversation.findUnique({
        where: { id: conversationId },
        include: {
          participants: true,
        },
      });

      if (!conversation) {
        return c.json({ error: "Conversation not found" }, 404);
      }

      const isParticipant = conversation.participants.some(
        (p) => p.userId === session.user.id
      );

      if (!isParticipant) {
        return c.json({ error: "Not authorized to send messages" }, 403);
      }

      // Get receiver ID (the other participant)
      const receiverId = conversation.participants.find(
        (p) => p.userId !== session.user.id
      )?.userId;

      if (!receiverId) {
        return c.json({ error: "Receiver not found" }, 404);
      }

      // Create message
      const message = await db.message.create({
        data: {
          content,
          conversationId,
          senderId: session.user.id,
          receiverId,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      // Update conversation timestamp
      await db.conversation.update({
        where: { id: conversationId },
        data: { updatedAt: new Date() },
      });

      // Trigger Pusher event for real-time delivery
      await pusherServer.trigger(
        `conversation-${conversationId}`,
        "new-message",
        message
      );

      // Trigger notification for receiver
      await pusherServer.trigger(
        `user-${receiverId}`,
        "new-message-notification",
        {
          conversationId,
          message,
        }
      );

      return c.json({ message });
    }
  )

  // Mark messages as read
  .patch("/:conversationId/read", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const conversationId = c.req.param("conversationId");

    // Update messages to read
    await db.message.updateMany({
      where: {
        conversationId,
        receiverId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    // Update last read timestamp
    await db.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId: session.user.id,
      },
      data: {
        lastReadAt: new Date(),
      },
    });

    return c.json({ success: true });
  });

export { app as messages };
