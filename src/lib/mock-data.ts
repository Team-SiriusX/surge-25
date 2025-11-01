import { JobType, ApplicationStatus, PostStatus } from "@/types/models";

export const mockUsers = [
  {
    id: "user-1",
    name: "Alex Johnson",
    email: "alex@example.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    skills: ["React", "TypeScript", "Node.js", "UI Design"],
    interests: ["Startups", "Web Development", "AI"],
    resume: "/resume-alex.pdf",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-10-20"),
  },
];

export const mockJobPosts = [
  {
    id: "job-1",
    title: "Full-Stack Developer for AI Startup",
    description:
      "We are looking for an experienced full-stack developer to join our fast-growing AI startup. You will work on building scalable web applications and APIs using modern tech stack.",
    type: JobType.STARTUP_COLLABORATION,
    tags: ["React", "Node.js", "TypeScript", "PostgreSQL", "AI"],
    location: "San Francisco, CA",
    duration: "3-6 months",
    compensation: "$15-20/hour",
    requirements: [
      "Proficiency in React and Node.js",
      "Experience with TypeScript",
      "Database design experience",
    ],
    status: PostStatus.ACTIVE,
    isFilled: false,
    posterId: "poster-1",
    createdAt: new Date("2024-10-15"),
    updatedAt: new Date("2024-10-15"),
  },
  {
    id: "job-2",
    title: "UI/UX Designer for Team",
    description:
      "Help our product team design beautiful and intuitive user interfaces. You will collaborate with developers and product managers to create delightful user experiences.",
    type: JobType.COMPETITION_HACKATHON,
    tags: ["Figma", "UI Design", "UX", "Prototyping"],
    location: "Remote",
    duration: "2-4 months",
    compensation: "Flexible",
    requirements: [
      "Strong portfolio",
      "Proficiency in Figma",
      "Understanding of UX principles",
    ],
    status: PostStatus.ACTIVE,
    isFilled: false,
    posterId: "poster-2",
    createdAt: new Date("2024-10-14"),
    updatedAt: new Date("2024-10-14"),
  },
  {
    id: "job-3",
    title: "Academic Project: Data Visualization Dashboard",
    description:
      "Build a web-based dashboard to visualize complex datasets. This is an academic project with focus on learning and implementation of advanced visualization techniques.",
    type: JobType.ACADEMIC_PROJECT,
    tags: ["Data Visualization", "D3.js", "React", "Statistics"],
    location: "Remote",
    duration: "2-3 months",
    compensation: "Certificate + Letter of Recommendation",
    requirements: [
      "Familiarity with D3.js or similar library",
      "Strong JavaScript skills",
      "Understanding of data structures",
    ],
    status: PostStatus.ACTIVE,
    isFilled: false,
    posterId: "poster-3",
    createdAt: new Date("2024-10-13"),
    updatedAt: new Date("2024-10-13"),
  },
  {
    id: "job-4",
    title: "Mobile App Developer - Part Time",
    description:
      "Work part-time on our React Native mobile application. Build and maintain features for our iOS and Android apps.",
    type: JobType.PART_TIME_JOB,
    tags: ["React Native", "Mobile", "JavaScript", "Firebase"],
    location: "Remote",
    duration: "6-12 months",
    compensation: "$12-18/hour",
    requirements: [
      "Experience with React Native",
      "Knowledge of iOS/Android",
      "Git proficiency",
    ],
    status: PostStatus.ACTIVE,
    isFilled: false,
    posterId: "poster-4",
    createdAt: new Date("2024-10-12"),
    updatedAt: new Date("2024-10-12"),
  },
  {
    id: "job-5",
    title: "HackBuild 2024: Find Your Team",
    description:
      "Looking for talented developers and designers to form a team for HackBuild 2024! We have an exciting idea for a productivity app and need skilled collaborators.",
    type: JobType.COMPETITION_HACKATHON,
    tags: ["Hackathon", "Full-Stack", "Innovation", "Team"],
    location: "New York, NY",
    duration: "48 hours",
    compensation: "Prizes + Networking",
    requirements: [
      "Passion for innovation",
      "Problem-solving skills",
      "Ability to work under pressure",
    ],
    status: PostStatus.ACTIVE,
    isFilled: false,
    posterId: "poster-5",
    createdAt: new Date("2024-10-11"),
    updatedAt: new Date("2024-10-11"),
  },
  {
    id: "job-6",
    title: "Backend Engineer - Startup",
    description:
      "Join our backend team to build scalable APIs and microservices. Work with cutting-edge technologies and grow with a fast-moving startup.",
    type: JobType.STARTUP_COLLABORATION,
    tags: ["Node.js", "PostgreSQL", "AWS", "Docker", "Microservices"],
    location: "Boston, MA",
    duration: "6 months",
    compensation: "$18-25/hour",
    requirements: [
      "Backend development experience",
      "Knowledge of databases",
      "Familiarity with AWS or similar cloud platforms",
    ],
    status: PostStatus.ACTIVE,
    isFilled: false,
    posterId: "poster-6",
    createdAt: new Date("2024-10-10"),
    updatedAt: new Date("2024-10-10"),
  },
];

export const mockApplications = [
  {
    id: "app-1",
    coverLetter:
      "I am very interested in this position. My experience with React and Node.js makes me a perfect fit for your team.",
    resumeUrl: "/resume-alex.pdf",
    status: ApplicationStatus.SHORTLISTED,
    appliedAt: new Date("2024-10-16"),
    updatedAt: new Date("2024-10-18"),
    jobPostId: "job-1",
    applicantId: "user-1",
    jobPost: mockJobPosts[0],
  },
  {
    id: "app-2",
    coverLetter:
      "Excited about the design opportunity. I have 3 years of UI/UX experience and a strong portfolio.",
    resumeUrl: "/resume-alex.pdf",
    status: ApplicationStatus.PENDING,
    appliedAt: new Date("2024-10-17"),
    updatedAt: new Date("2024-10-17"),
    jobPostId: "job-2",
    applicantId: "user-1",
    jobPost: mockJobPosts[1],
  },
  {
    id: "app-3",
    coverLetter:
      "Data visualization is my passion. Looking forward to contributing to this project.",
    resumeUrl: "/resume-alex.pdf",
    status: ApplicationStatus.REJECTED,
    appliedAt: new Date("2024-10-14"),
    updatedAt: new Date("2024-10-16"),
    jobPostId: "job-3",
    applicantId: "user-1",
    jobPost: mockJobPosts[2],
  },
];

export const mockSavedJobs = [
  { id: "saved-1", jobPostId: "job-4", userId: "user-1", savedAt: new Date() },
  { id: "saved-2", jobPostId: "job-5", userId: "user-1", savedAt: new Date() },
];

interface JobPostType {
  id: string;
  title: string;
  description: string;
  type: JobType;
  tags: string[];
  location?: string;
  duration?: string;
  compensation?: string;
  requirements: string[];
  status: PostStatus;
  isFilled: boolean;
  posterId: string;
  createdAt: Date;
  updatedAt: Date;
}
