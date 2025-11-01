import { PrismaClient } from "../src/generated/prisma";
import {
  UserRole,
  JobType,
  JobCategory,
  PostStatus,
  ApplicationStatus,
  NotificationType,
} from "../src/generated/prisma";

const prisma = new PrismaClient();

// Helper function to generate random date within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Helper function to pick random items from array
const pickRandom = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

async function main() {
  // Get userId from command line arguments
  const userId = "C3gAumlIn5aiRCitoVNeZRvC9GZbADpp";

  console.log("🌱 Starting database seed...");
  if (userId) {
    console.log(`📌 Seeding data for user ID: ${userId}`);
  }

  // Skip database cleaning to preserve existing data
  console.log(
    "⏭️  Skipping database cleanup - existing data will be preserved"
  );

  // Sample data arrays
  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "Go",
    "Rust",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "GraphQL",
    "REST API",
    "Machine Learning",
    "Deep Learning",
    "Data Science",
    "UI/UX Design",
    "Figma",
    "Adobe XD",
    "Content Writing",
    "SEO",
    "Digital Marketing",
    "Product Management",
    "Agile",
    "Scrum",
  ];

  const interests = [
    "Web Development",
    "Mobile Development",
    "AI/ML",
    "Blockchain",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps",
    "Game Development",
    "Data Analytics",
    "UI/UX Design",
    "Product Design",
    "Content Creation",
    "Digital Marketing",
    "Entrepreneurship",
    "Startups",
    "Open Source",
    "Competitive Programming",
    "Hackathons",
    "Research",
    "Teaching",
  ];

  const universities = [
    "MIT",
    "Stanford University",
    "Harvard University",
    "UC Berkeley",
    "Carnegie Mellon University",
    "Georgia Tech",
    "University of Washington",
    "Cornell University",
    "University of Michigan",
    "UT Austin",
  ];

  const majors = [
    "Computer Science",
    "Software Engineering",
    "Data Science",
    "Information Technology",
    "Computer Engineering",
    "Electrical Engineering",
    "Business Administration",
    "Marketing",
    "Design",
    "Mathematics",
  ];

  // Create Users
  console.log("👥 Creating users...");

  let targetUser: any = null;

  // If userId is provided, verify it exists
  if (userId) {
    targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      console.error(`❌ User with ID ${userId} not found!`);
      process.exit(1);
    }

    console.log(`✅ Found user: ${targetUser.name} (${targetUser.email})`);
  }

  // Check if users already exist
  const existingUsers = await prisma.user.findMany();
  let users: any[] = [];

  if (existingUsers.length > 0) {
    console.log(`✅ Found ${existingUsers.length} existing users, skipping user creation`);
    users = existingUsers;
  } else {
    console.log("Creating new users...");
    users = await Promise.all([
      // Admin user
      prisma.user.create({
        data: {
          name: "Admin User",
          email: "admin@campusconnect.com",
          emailVerified: true,
          role: UserRole.ADMIN,
          bio: "Platform administrator",
          skills: ["Management", "Support"],
          interests: ["Community Building"],
          university: "MIT",
          major: "Computer Science",
          graduationYear: 2024,
          profileScore: 100,
        },
      }),
      // Regular users
      ...Array.from({ length: 20 }, (_, i) =>
        prisma.user.create({
          data: {
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            emailVerified: i % 3 !== 0, // Some unverified emails
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
            role: UserRole.USER,
            bio: `I'm a passionate student interested in technology and innovation. Looking for opportunities to grow and collaborate on exciting projects.`,
            skills: pickRandom(skills, Math.floor(Math.random() * 8) + 3),
            interests: pickRandom(interests, Math.floor(Math.random() * 6) + 2),
            resume: i % 2 === 0 ? `https://example.com/resume${i + 1}.pdf` : null,
            phone: i % 3 === 0 ? `+1-555-${1000 + i}` : null,
            linkedIn: i % 2 === 0 ? `https://linkedin.com/in/user${i + 1}` : null,
            github: i % 2 === 0 ? `https://github.com/user${i + 1}` : null,
            portfolio: i % 3 === 0 ? `https://portfolio-user${i + 1}.com` : null,
            university:
              universities[Math.floor(Math.random() * universities.length)],
            major: majors[Math.floor(Math.random() * majors.length)],
            graduationYear: 2024 + Math.floor(Math.random() * 4),
            profileScore: Math.floor(Math.random() * 40) + 60,
          },
        })
      ),
    ]);

    console.log(`✅ Created ${users.length} users`);
  }

  // Create Job Posts
  console.log("💼 Creating job posts...");
  const jobTitles = {
    [JobType.ACADEMIC_PROJECT]: [
      "ML Research Assistant Needed",
      "Web Development Project Partner",
      "Mobile App Development Team",
      "Data Analysis Research Project",
      "Blockchain Research Collaboration",
    ],
    [JobType.STARTUP_COLLABORATION]: [
      "Co-founder for EdTech Startup",
      "Early Engineer for FinTech Startup",
      "Product Designer for SaaS Startup",
      "Marketing Lead for Health Tech",
      "Full Stack Developer for AI Startup",
    ],
    [JobType.PART_TIME_JOB]: [
      "Part-Time Frontend Developer",
      "Campus Brand Ambassador",
      "Content Writer (Remote)",
      "Social Media Manager",
      "Part-Time Data Entry Specialist",
    ],
    [JobType.COMPETITION_HACKATHON]: [
      "Looking for Hackathon Team Members",
      "AI/ML Competition Team",
      "Design Competition Partner",
      "Coding Competition Teammate",
      "Business Case Competition Team",
    ],
    [JobType.INTERNSHIP]: [
      "Summer Software Engineering Intern",
      "Product Management Intern",
      "UX Design Intern",
      "Data Science Intern",
      "Marketing Intern",
    ],
    [JobType.FREELANCE]: [
      "Freelance Web Developer Needed",
      "Graphic Designer for Startup",
      "Content Writer for Blog",
      "SEO Specialist",
      "Video Editor for YouTube",
    ],
  };

  const jobDescriptions = {
    [JobType.ACADEMIC_PROJECT]: [
      "We're working on an exciting academic research project and need collaborators. This is a great opportunity to gain research experience and potentially publish papers.",
      "Join our academic project team to explore cutting-edge technology. Perfect for students looking to enhance their portfolio.",
      "Seeking motivated students for a semester-long research project. Excellent learning opportunity with potential for publication.",
    ],
    [JobType.STARTUP_COLLABORATION]: [
      "We're building the next big thing and looking for passionate individuals to join our founding team. Equity and flexible hours available.",
      "Early-stage startup seeking talented individuals who want to make an impact. Work on real products with real users.",
      "Join our startup journey! We're looking for someone who wants to build something from scratch and grow with the company.",
    ],
    [JobType.PART_TIME_JOB]: [
      "Flexible part-time position perfect for students. Work around your class schedule and gain valuable industry experience.",
      "Looking for a part-time team member to help with ongoing projects. Remote work options available.",
      "Part-time opportunity with competitive pay. Great for students looking to earn while learning.",
    ],
    [JobType.COMPETITION_HACKATHON]: [
      "Building a team for an upcoming hackathon. Looking for passionate developers and designers who want to win!",
      "Competition coming up and we need team members. Let's build something amazing together!",
      "Experienced hackathon participant looking for teammates. Let's compete and learn together!",
    ],
    [JobType.INTERNSHIP]: [
      "Internship opportunity at a growing company. Work on real projects and gain hands-on experience in a professional environment.",
      "We're looking for interns to join our team for the summer. Mentorship and learning opportunities provided.",
      "Paid internship with potential for full-time conversion. Great opportunity to kickstart your career.",
    ],
    [JobType.FREELANCE]: [
      "Freelance opportunity for skilled professionals. Work on your own schedule and build your portfolio.",
      "Looking for freelancers to help with ongoing projects. Competitive rates and flexible deadlines.",
      "Freelance project available. Perfect for students looking to earn extra income while studying.",
    ],
  };

  const jobPosts: any[] = [];
  const jobTypes = Object.values(JobType);
  const jobCategories = Object.values(JobCategory);

  for (let i = 0; i < 50; i++) {
    const type = jobTypes[
      Math.floor(Math.random() * jobTypes.length)
    ] as JobType;
    const category = jobCategories[
      Math.floor(Math.random() * jobCategories.length)
    ] as JobCategory;

    // If userId provided, make this user the poster for all jobs
    // Otherwise, randomly select a poster from the created users
    const poster =
      targetUser && Math.random() > 0.3  // 70% chance target user, 30% other users
        ? targetUser 
        : users[Math.floor(Math.random() * users.length)];

    const titles = jobTitles[type];
    const descriptions = jobDescriptions[type];

    const status =
      Math.random() > 0.85
        ? PostStatus.CLOSED
        : Math.random() > 0.9
        ? PostStatus.DRAFT
        : PostStatus.ACTIVE;

    const createdAt = randomDate(new Date(2024, 6, 1), new Date());

    jobPosts.push(
      await prisma.jobPost.create({
        data: {
          title: titles[Math.floor(Math.random() * titles.length)],
          description:
            descriptions[Math.floor(Math.random() * descriptions.length)],
          type,
          category,
          tags: pickRandom(skills, Math.floor(Math.random() * 5) + 2),
          location:
            Math.random() > 0.5
              ? "Remote"
              : Math.random() > 0.5
              ? "On-campus"
              : `${
                  ["New York", "San Francisco", "Boston", "Seattle", "Austin"][
                    Math.floor(Math.random() * 5)
                  ]
                }`,
          duration:
            type === JobType.INTERNSHIP
              ? `${[3, 6, 12][Math.floor(Math.random() * 3)]} months`
              : type === JobType.PART_TIME_JOB
              ? "Flexible"
              : type === JobType.ACADEMIC_PROJECT
              ? "1 semester"
              : null,
          compensation:
            type === JobType.INTERNSHIP || type === JobType.PART_TIME_JOB
              ? `$${[15, 20, 25, 30][Math.floor(Math.random() * 4)]}/hr`
              : type === JobType.FREELANCE
              ? `$${
                  [500, 1000, 2000, 3000][Math.floor(Math.random() * 4)]
                } project`
              : type === JobType.STARTUP_COLLABORATION
              ? "Equity + Stipend"
              : Math.random() > 0.5
              ? "Paid"
              : "Unpaid",
          requirements: pickRandom(skills, Math.floor(Math.random() * 4) + 2),
          status,
          isDraft: status === PostStatus.DRAFT,
          isFilled: status === PostStatus.CLOSED && Math.random() > 0.5,
          views: Math.floor(Math.random() * 500),
          applicationsCount: Math.floor(Math.random() * 50),
          posterId: poster.id,
          createdAt,
          updatedAt: createdAt,
          expiresAt:
            status === PostStatus.ACTIVE
              ? new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000)
              : null,
        },
      })
    );
  }

  console.log(`✅ Created ${jobPosts.length} job posts`);

  // Create Applications
  console.log("📝 Creating applications...");
  const applications: any[] = [];
  const activeJobs = jobPosts.filter((job) => job.status === PostStatus.ACTIVE);

  for (let i = 0; i < 100; i++) {
    const job = activeJobs[Math.floor(Math.random() * activeJobs.length)];

    // Select applicant: if userId provided and sometimes random user, otherwise always random
    let applicant: any;
    if (targetUser && Math.random() > 0.3) {
      // 70% chance use target user, 30% use random user for diversity
      applicant = targetUser;
    } else {
      applicant = users[Math.floor(Math.random() * users.length)];
    }

    // Skip if user is the poster or application already exists
    if (applicant.id === job.posterId) continue;

    const existingApplication = applications.find(
      (app) => app.jobPostId === job.id && app.applicantId === applicant.id
    );
    if (existingApplication) continue;

    const statusValues = Object.values(ApplicationStatus);
    const status =
      statusValues[Math.floor(Math.random() * statusValues.length)];

    const appliedAt = randomDate(job.createdAt, new Date());

    try {
      applications.push(
        await prisma.application.create({
          data: {
            jobPostId: job.id,
            applicantId: applicant.id,
            coverLetter: `I am very interested in this opportunity. With my background in ${
              applicant.major
            } and skills in ${applicant.skills
              .slice(0, 3)
              .join(
                ", "
              )}, I believe I would be a great fit for this position.`,
            resumeUrl: applicant.resume,
            customMessage:
              Math.random() > 0.5
                ? "I'm available for an interview at your convenience. Looking forward to hearing from you!"
                : null,
            status,
            matchScore: Math.floor(Math.random() * 40) + 60,
            appliedAt,
            updatedAt: appliedAt,
          },
        })
      );
    } catch (error) {
      // Skip duplicate applications
      continue;
    }
  }

  console.log(`✅ Created ${applications.length} applications`);

  // Update job posts with application counts
  console.log("📊 Updating job post application counts...");
  const jobApplicationCounts = new Map<string, number>();
  
  // Count applications per job
  for (const app of applications) {
    const count = jobApplicationCounts.get(app.jobPostId) || 0;
    jobApplicationCounts.set(app.jobPostId, count + 1);
  }
  
  // Update each job post
  for (const [jobId, count] of jobApplicationCounts.entries()) {
    await prisma.jobPost.update({
      where: { id: jobId },
      data: { 
        applicationsCount: count,
        interestRate: count > 0 ? count / (jobPosts.find(j => j.id === jobId)?.views || 1) : 0
      },
    });
  }
  
  console.log(`✅ Updated ${jobApplicationCounts.size} job posts with application counts`);

  // Create Saved Jobs
  console.log("💾 Creating saved jobs...");
  const savedJobs: any[] = [];

  for (let i = 0; i < 80; i++) {
    const job = jobPosts[Math.floor(Math.random() * jobPosts.length)];

    // Select user: if userId provided and sometimes random user, otherwise always random
    let user: any;
    if (targetUser && Math.random() > 0.3) {
      // 70% chance use target user, 30% use random user for diversity
      user = targetUser;
    } else {
      user = users[Math.floor(Math.random() * users.length)];
    }

    // Skip if user is the poster
    if (user.id === job.posterId) continue;

    try {
      savedJobs.push(
        await prisma.savedJob.create({
          data: {
            userId: user.id,
            jobPostId: job.id,
            savedAt: randomDate(job.createdAt, new Date()),
          },
        })
      );
    } catch (error) {
      // Skip duplicates
      continue;
    }
  }

  console.log(`✅ Created ${savedJobs.length} saved jobs`);

  // Create Conversations and Messages
  console.log("💬 Creating conversations and messages...");
  const conversations: any[] = [];
  const messages: any[] = [];

  for (let i = 0; i < 30; i++) {
    // Create diverse conversations
    let user1: any, user2: any;

    if (targetUser && Math.random() > 0.3) {
      // 70% chance target user is in conversation
      user1 = targetUser;
      user2 = users[Math.floor(Math.random() * users.length)];

      // Ensure user2 is not the same as user1
      while (user2.id === user1.id) {
        user2 = users[Math.floor(Math.random() * users.length)];
      }
    } else {
      // 30% chance create conversation between other users
      user1 = users[Math.floor(Math.random() * users.length)];
      user2 = users[Math.floor(Math.random() * users.length)];

      if (user1.id === user2.id) continue;
    }

    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId: user1.id, lastReadAt: new Date() },
            {
              userId: user2.id,
              lastReadAt: randomDate(new Date(2024, 10, 1), new Date()),
            },
          ],
        },
      },
    });

    conversations.push(conversation);

    // Create messages for this conversation
    const messageCount = Math.floor(Math.random() * 10) + 2;
    let lastMessageTime = randomDate(new Date(2024, 9, 1), new Date());

    for (let j = 0; j < messageCount; j++) {
      const sender = j % 2 === 0 ? user1 : user2;
      const receiver = j % 2 === 0 ? user2 : user1;

      const messageTexts = [
        "Hi! I saw your job posting and I'm interested.",
        "Thanks for reaching out! When would you be available for a call?",
        "I'm free tomorrow afternoon. Does 2 PM work for you?",
        "That works for me! I'll send you a meeting link.",
        "Great! Looking forward to it.",
        "Can you tell me more about the project requirements?",
        "Sure! I'll send you the details.",
        "Thanks! I'll review it and get back to you.",
        "Sounds good. Let me know if you have any questions.",
        "Will do! Thanks for the opportunity.",
      ];

      lastMessageTime = new Date(
        lastMessageTime.getTime() + Math.random() * 3600000
      );

      messages.push(
        await prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: sender.id,
            receiverId: receiver.id,
            content: messageTexts[j % messageTexts.length],
            isRead: Math.random() > 0.3,
            createdAt: lastMessageTime,
          },
        })
      );
    }
  }

  console.log(
    `✅ Created ${conversations.length} conversations with ${messages.length} messages`
  );

  // Create Notifications
  console.log("🔔 Creating notifications...");
  const notifications: any[] = [];

  for (let i = 0; i < 100; i++) {
    // Select user: if userId provided and sometimes random user, otherwise always random
    let user: any;
    if (targetUser && Math.random() > 0.3) {
      // 70% chance use target user, 30% use random user for diversity
      user = targetUser;
    } else {
      user = users[Math.floor(Math.random() * users.length)];
    }

    const notificationTypes = Object.values(NotificationType);
    const type = notificationTypes[
      Math.floor(Math.random() * notificationTypes.length)
    ] as NotificationType;

    const notificationData: Record<
      NotificationType,
      { title: string; message: string; link?: string }
    > = {
      [NotificationType.APPLICATION_RECEIVED]: {
        title: "New Application Received",
        message: `You received a new application for your job posting "${jobPosts[0].title}"`,
        link: "/dashboard/finder/applications",
      },
      [NotificationType.APPLICATION_STATUS_CHANGED]: {
        title: "Application Status Updated",
        message: "Your application status has been updated to Shortlisted",
        link: "/dashboard/seeker/applications",
      },
      [NotificationType.NEW_MESSAGE]: {
        title: "New Message",
        message: "You have a new message from a potential employer",
        link: "/dashboard/messages",
      },
      [NotificationType.JOB_EXPIRED]: {
        title: "Job Post Expired",
        message: "Your job posting has expired. Click here to renew it.",
        link: "/dashboard/finder/jobs",
      },
      [NotificationType.JOB_FILLED]: {
        title: "Job Position Filled",
        message: "Congratulations! Your job position has been filled.",
        link: "/dashboard/finder/jobs",
      },
      [NotificationType.NEW_RECOMMENDATION]: {
        title: "New Job Recommendation",
        message: "We found a job that matches your skills and interests",
        link: "/dashboard/seeker/explore",
      },
      [NotificationType.SHORTLISTED]: {
        title: "You've Been Shortlisted!",
        message: `You've been shortlisted for "${jobPosts[0].title}"`,
        link: "/dashboard/seeker/applications",
      },
      [NotificationType.ACCEPTED]: {
        title: "Application Accepted!",
        message: `Congratulations! Your application for "${jobPosts[0].title}" has been accepted`,
        link: "/dashboard/seeker/applications",
      },
      [NotificationType.REJECTED]: {
        title: "Application Update",
        message: `Your application for "${jobPosts[0].title}" was not selected this time`,
        link: "/dashboard/seeker/applications",
      },
    };

    const data = notificationData[type];
    const createdAt = randomDate(new Date(2024, 9, 1), new Date());

    notifications.push(
      await prisma.notification.create({
        data: {
          userId: user.id,
          type,
          title: data.title,
          message: data.message,
          link: data.link,
          isRead: Math.random() > 0.4,
          readAt: Math.random() > 0.4 ? createdAt : null,
          createdAt,
          metadata: {
            jobId: jobPosts[Math.floor(Math.random() * jobPosts.length)].id,
          },
        },
      })
    );
  }

  console.log(`✅ Created ${notifications.length} notifications`);

  console.log("\n🎉 Database seeding completed successfully!");

  if (targetUser) {
    console.log(
      `\n✨ All data has been associated with user: ${targetUser.name} (${targetUser.email})`
    );
    console.log(`   User ID: ${targetUser.id}`);
  }

  console.log("\n📊 Summary:");
  console.log(`   Users: ${users.length}`);
  console.log(`   Job Posts: ${jobPosts.length}`);
  console.log(`   Applications: ${applications.length}`);
  console.log(`   Saved Jobs: ${savedJobs.length}`);
  console.log(`   Conversations: ${conversations.length}`);
  console.log(`   Messages: ${messages.length}`);
  console.log(`   Notifications: ${notifications.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
