export const enum QUERY_KEYS {
  SAMPLE = "sample",
  POST = "post",
  FINDER_JOBS = "finder-jobs",
  FINDER_JOB = "finder-job",
  FINDER_APPLICATIONS = "finder-applications",
  FINDER_APPLICATION = "finder-application",
  FINDER_DASHBOARD_STATS = "finder-dashboard-stats",
  SEEKER_JOBS = "seeker-jobs",
  SEEKER_JOB = "seeker-job",
  SEEKER_SAVED_JOBS = "seeker-saved-jobs",
  CONVERSATIONS = "conversations",
  CONVERSATION = "conversation",
  MESSAGES = "messages",
  SEEKER_APPLICATIONS = "seeker-applications",
  SEEKER_APPLICATION = "seeker-application",
  PROFILE_CHAT = "profile-chat",
  NOTIFICATIONS = "notifications",
  NOTIFICATION_COUNT = "notification-count",
}

export const queryKeys = {
  conversations: {
    list: () => [QUERY_KEYS.CONVERSATIONS],
    detail: (id: string) => [QUERY_KEYS.CONVERSATION, id],
  },
  messages: {
    list: (conversationId: string) => [QUERY_KEYS.MESSAGES, conversationId],
  },
  notifications: {
    list: () => [QUERY_KEYS.NOTIFICATIONS],
    unreadCount: () => [QUERY_KEYS.NOTIFICATION_COUNT],
  },
};
