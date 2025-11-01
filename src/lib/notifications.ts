import { $Enums } from "@/generated/prisma";

type CreateNotificationInput = {
  userId: string;
  type: $Enums.NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: any;
};

export async function createNotification(input: CreateNotificationInput) {
  try {
    const res = await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      throw new Error("Failed to create notification");
    }

    return res.json();
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

// Helper functions for common notification types
export const notificationHelpers = {
  applicationReceived: (userId: string, jobTitle: string, applicantName: string) =>
    createNotification({
      userId,
      type: "APPLICATION_RECEIVED",
      title: "New Application Received",
      message: `${applicantName} has applied for ${jobTitle}`,
      link: "/finder/posts",
    }),

  applicationStatusChanged: (
    userId: string,
    jobTitle: string,
    status: "shortlisted" | "accepted" | "rejected"
  ) =>
    createNotification({
      userId,
      type: "APPLICATION_STATUS_CHANGED",
      title: "Application Status Updated",
      message: `Your application for ${jobTitle} has been ${status}`,
      link: "/seeker/applications",
    }),

  shortlisted: (userId: string, jobTitle: string, companyName: string) =>
    createNotification({
      userId,
      type: "SHORTLISTED",
      title: "You've Been Shortlisted! 🎉",
      message: `${companyName} has shortlisted you for ${jobTitle}`,
      link: "/seeker/applications",
    }),

  accepted: (userId: string, jobTitle: string, companyName: string) =>
    createNotification({
      userId,
      type: "ACCEPTED",
      title: "Congratulations! 🎊",
      message: `Your application for ${jobTitle} at ${companyName} has been accepted`,
      link: "/seeker/applications",
    }),

  rejected: (userId: string, jobTitle: string) =>
    createNotification({
      userId,
      type: "REJECTED",
      title: "Application Update",
      message: `Your application for ${jobTitle} was not selected`,
      link: "/seeker/applications",
    }),

  newMessage: (userId: string, senderName: string, conversationId: string) =>
    createNotification({
      userId,
      type: "NEW_MESSAGE",
      title: "New Message",
      message: `${senderName} sent you a message`,
      link: `/finder/messages?conversation=${conversationId}`,
    }),

  jobExpired: (userId: string, jobTitle: string) =>
    createNotification({
      userId,
      type: "JOB_EXPIRED",
      title: "Job Post Expired",
      message: `Your job post "${jobTitle}" has expired`,
      link: "/finder/posts",
    }),
};
