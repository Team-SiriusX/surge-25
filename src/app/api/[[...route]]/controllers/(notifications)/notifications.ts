import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { $Enums } from "@/generated/prisma";

const app = new Hono()
  // Get all notifications for the current user
  .get("/", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const notifications = await db.notification.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json({ notifications });
  })

  // Get unread notification count
  .get("/unread-count", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const count = await db.notification.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    });

    return c.json({ count });
  })

  // Mark a notification as read
  .patch(
    ":notificationId/read",
    async (c) => {
      const session = await auth.api.getSession({
        headers: c.req.raw.headers,
      });

      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const notificationId = c.req.param("notificationId");

      const notification = await db.notification.findUnique({
        where: { id: notificationId },
      });

      if (!notification) {
        return c.json({ error: "Notification not found" }, 404);
      }

      if (notification.userId !== session.user.id) {
        return c.json({ error: "Not authorized" }, 403);
      }

      const updatedNotification = await db.notification.update({
        where: { id: notificationId },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      return c.json({ notification: updatedNotification });
    }
  )

  // Mark all notifications as read
  .patch("/read-all", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await db.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return c.json({ success: true });
  })

  // Create a notification (typically used internally or by admin)
  .post(
    "/",
    zValidator(
      "json",
      z.object({
        userId: z.string(),
        type: z.nativeEnum($Enums.NotificationType),
        title: z.string(),
        message: z.string(),
        link: z.string().optional(),
        metadata: z.any().optional(),
      })
    ),
    async (c) => {
      const session = await auth.api.getSession({
        headers: c.req.raw.headers,
      });

      if (!session) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const data = c.req.valid("json");

      // Create notification
      const notification = await db.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          link: data.link,
          metadata: data.metadata,
        },
      });

      // Trigger Pusher event for real-time notification
      await pusherServer.trigger(
        `user-${data.userId}`,
        "new-notification",
        notification
      );

      return c.json({ notification });
    }
  )

  // Delete a notification
  .delete(":notificationId", async (c) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const notificationId = c.req.param("notificationId");

    const notification = await db.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      return c.json({ error: "Notification not found" }, 404);
    }

    if (notification.userId !== session.user.id) {
      return c.json({ error: "Not authorized" }, 403);
    }

    await db.notification.delete({
      where: { id: notificationId },
    });

    return c.json({ success: true });
  });

export { app as notifications };
