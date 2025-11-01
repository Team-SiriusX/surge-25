import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { ApplicationStatus } from "@/types/models";

const conversationListInclude = {
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
      description: true,
      poster: {
        select: {
          id: true,
          name: true,
          university: true,
        },
      },
    },
  },
} as const;

const conversationDetailInclude = {
  ...conversationListInclude,
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
          email: true,
        },
      },
      receiver: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
    },
  },
} as const;

const mapJobPostMeta = (jobPost: any) => {
  if (!jobPost) return null;

  const posterName = jobPost.poster?.name ?? null;
  const posterUniversity = jobPost.poster?.university ?? null;

  return {
    id: jobPost.id,
    title: jobPost.title,
    description: jobPost.description ?? null,
    companyName: posterName ?? posterUniversity ?? "Hiring Team",
    poster: jobPost.poster
      ? {
          id: jobPost.poster.id,
          name: posterName ?? "Hiring Team",
          university: posterUniversity,
        }
      : null,
  };
};

const getConversationApplication = async (
  conversation: any,
  currentUserId: string
) => {
  if (!conversation.jobPostId) return null;

  const otherParticipant = conversation.participants?.find(
    (participant: any) => participant.userId !== currentUserId
  );

  if (!otherParticipant) return null;

  return db.application.findFirst({
    where: {
      jobPostId: conversation.jobPostId,
      applicantId: otherParticipant.userId,
    },
    select: {
      id: true,
      status: true,
      applicantId: true,
      jobPostId: true,
    },
  });
};

const transformConversationForList = async (
  conversation: any,
  currentUserId: string
) => {
  const [lastMessage, unreadCount, application] = await Promise.all([
    db.message.findFirst({
      where: {
        conversationId: conversation.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    }),
    db.message.count({
      where: {
        conversationId: conversation.id,
        receiverId: currentUserId,
        isRead: false,
      },
    }),
    getConversationApplication(conversation, currentUserId),
  ]);

  const { jobPost, ...rest } = conversation;

  return {
    ...rest,
    jobPost: mapJobPostMeta(jobPost),
    lastMessage,
    unreadCount,
    application,
  };
};

const transformConversationWithMessages = async (
  conversation: any,
  currentUserId: string
) => {
  const [application, unreadCount] = await Promise.all([
    getConversationApplication(conversation, currentUserId),
    db.message.count({
      where: {
        conversationId: conversation.id,
        receiverId: currentUserId,
        isRead: false,
      },
    }),
  ]);

  const messages = conversation.messages ?? [];
  const lastMessage =
    messages.length > 0 ? messages[messages.length - 1] : null;

  const { jobPost, ...rest } = conversation;

  return {
    ...rest,
    jobPost: mapJobPostMeta(jobPost),
    messages,
    lastMessage,
    unreadCount,
    application,
  };
};

const app = new Hono()
  // Get all conversations for the current user
  .get("/conversations", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const rawConversations = await db.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
          },
        },
      },
      include: conversationListInclude,
      orderBy: {
        updatedAt: "desc",
      },
    });

    const conversations = await Promise.all(
      rawConversations.map((conversation) =>
        transformConversationForList(conversation, session.user.id)
      )
    );

    // Filter to only show conversations with shortlisted applicants
    const filteredConversations = conversations.filter((conversation) => {
      if (!conversation.jobPostId) return true; // Non-job conversations are always visible
      const status = conversation.application?.status;
      return status === ApplicationStatus.SHORTLISTED; // Only show shortlisted
    });

    return c.json({ conversations: filteredConversations });
  })

  // Get a specific conversation with all messages
  .get(":conversationId", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const conversationId = c.req.param("conversationId");

    const baseConversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
        participants: true,
      },
    });

    if (!baseConversation) {
      return c.json({ error: "Conversation not found" }, 404);
    }

    // Check if user is a participant
    const isParticipant = baseConversation.participants.some(
      (p) => p.userId === session.user.id
    );

    if (!isParticipant) {
      return c.json({ error: "Not authorized to view this conversation" }, 403);
    }

    // Verify this is a shortlisted conversation if it's job-related
    if (baseConversation.jobPostId) {
      const application = await getConversationApplication(
        baseConversation,
        session.user.id
      );

      if (application?.status !== ApplicationStatus.SHORTLISTED) {
        return c.json({ error: "Conversation not available" }, 403);
      }
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

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: conversationDetailInclude,
    });

    if (!conversation) {
      return c.json({ error: "Conversation not found" }, 404);
    }

    const transformedConversation = await transformConversationWithMessages(
      conversation,
      session.user.id
    );

    return c.json({ conversation: transformedConversation });
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

      if (receiverId === session.user.id) {
        return c.json({ error: "Cannot create a conversation with yourself" }, 400);
      }

      // Verify shortlisted status for job-related conversations
      if (jobPostId) {
        const shortlistedApplication = await db.application.findFirst({
          where: {
            jobPostId,
            applicantId: receiverId,
            status: ApplicationStatus.SHORTLISTED,
          },
          select: {
            id: true,
          },
        });

        if (!shortlistedApplication) {
          return c.json(
            {
              error:
                "You can only start conversations with shortlisted applicants for this job.",
            },
            403
          );
        }
      }

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
            jobPostId ? { jobPostId } : { jobPostId: null },
          ],
        },
        include: conversationListInclude,
      });

      if (existingConversation) {
        const conversation = await transformConversationForList(
          existingConversation,
          session.user.id
        );

        return c.json({ conversation });
      }

      // Create new conversation
      const conversation = await db.conversation.create({
        data: {
          jobPostId: jobPostId ?? null,
          participants: {
            create: [
              { userId: session.user.id, lastReadAt: new Date() },
              { userId: receiverId },
            ],
          },
        },
        include: conversationListInclude,
      });

      const formattedConversation = await transformConversationForList(
        conversation,
        session.user.id
      );

      return c.json({ conversation: formattedConversation });
    }
  )

  // Send a message
  .post(
    ":conversationId/messages",
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

      // Verify shortlisted status for job-related conversations
      if (conversation.jobPostId) {
        const application = await getConversationApplication(
          conversation,
          session.user.id
        );

        if (application?.status !== ApplicationStatus.SHORTLISTED) {
          return c.json(
            {
              error:
                "You can only message shortlisted applicants for this job.",
            },
            403
          );
        }
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
              email: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
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
  .patch(":conversationId/read", async (c) => {
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
