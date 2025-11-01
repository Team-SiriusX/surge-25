// Re-export types from Prisma
export type {
  User,
  JobPost,
  Application,
  SavedJob,
  Conversation,
  Message,
  Notification,
} from "@/generated/prisma";

export {
  JobType,
  JobCategory,
  PostStatus,
  ApplicationStatus,
  NotificationType,
  UserRole,
} from "@/generated/prisma";
