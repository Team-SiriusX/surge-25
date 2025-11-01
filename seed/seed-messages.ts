import { PrismaClient } from "../src/generated/prisma";
import { JobType, JobCategory, PostStatus, ApplicationStatus } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting message seeding for specific users...");

  // Find or create the users
  const finderEmail = "mhassanali1210@gmail.com";
  const seekerEmail = "f2023266962@umt.edu.pk";

  let finder = await prisma.user.findUnique({
    where: { email: finderEmail },
  });

  let seeker = await prisma.user.findUnique({
    where: { email: seekerEmail },
  });

  if (!finder) {
    console.log(`📝 Creating finder user: ${finderEmail}`);
    finder = await prisma.user.create({
      data: {
        name: "Hassan Ali",
        email: finderEmail,
        emailVerified: true,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=hassan",
        bio: "Startup founder looking for talented developers to join our team",
        skills: ["JavaScript", "TypeScript", "React", "Node.js", "Product Management"],
        interests: ["Startups", "Web Development", "Entrepreneurship"],
        university: "UMT",
        major: "Computer Science",
        graduationYear: 2023,
        profileScore: 95,
      },
    });
  } else {
    console.log(`✅ Found finder user: ${finder.name}`);
  }

  if (!seeker) {
    console.log(`📝 Creating seeker user: ${seekerEmail}`);
    seeker = await prisma.user.create({
      data: {
        name: "Talha Ahmed",
        email: seekerEmail,
        emailVerified: true,
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=talha",
        bio: "Computer Science student passionate about full-stack development",
        skills: ["React", "Next.js", "TypeScript", "Python", "TailwindCSS"],
        interests: ["Web Development", "AI/ML", "Open Source"],
        university: "UMT",
        major: "Computer Science",
        graduationYear: 2025,
        profileScore: 88,
      },
    });
  } else {
    console.log(`✅ Found seeker user: ${seeker.name}`);
  }

  // Create a job post by the finder
  console.log("💼 Creating job post...");
  const jobPost = await prisma.jobPost.create({
    data: {
      title: "Full Stack Developer for EdTech Startup",
      description: `We're building an innovative education technology platform and looking for a talented full-stack developer to join our founding team.

**What you'll do:**
- Build and maintain our web application using React and Node.js
- Work on both frontend and backend features
- Collaborate with the founding team on product decisions
- Help shape the technical direction of the company

**What we're looking for:**
- Strong proficiency in React, TypeScript, and Node.js
- Experience with modern web development tools and practices
- Passion for education and making an impact
- Self-motivated and able to work independently

This is a great opportunity to join a startup early and grow with the company. We offer equity and flexible working hours.`,
      type: JobType.STARTUP_COLLABORATION,
      category: JobCategory.DEVELOPMENT,
      tags: ["React", "TypeScript", "Node.js", "Next.js", "Full Stack"],
      location: "Remote",
      duration: "Long-term",
      compensation: "Equity + Stipend",
      requirements: ["React", "TypeScript", "Node.js", "Git", "Problem Solving"],
      status: PostStatus.ACTIVE,
      isDraft: false,
      isFilled: false,
      views: 42,
      applicationsCount: 1,
      posterId: finder.id,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      expiresAt: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
    },
  });

  console.log(`✅ Created job post: ${jobPost.title}`);

  // Create application from seeker
  console.log("📝 Creating application...");
  const application = await prisma.application.create({
    data: {
      jobPostId: jobPost.id,
      applicantId: seeker.id,
      coverLetter: `Dear Hassan,

I am writing to express my strong interest in the Full Stack Developer position at your EdTech startup. As a Computer Science student at UMT with a passion for web development and education technology, I believe I would be a valuable addition to your founding team.

My experience with React, Next.js, and TypeScript aligns perfectly with your requirements. I have built several full-stack projects, including a student management system and a real-time collaboration tool. I am particularly excited about the opportunity to work on an education platform that can make a real impact on students' learning experiences.

I am highly motivated, quick to learn, and thrive in startup environments where I can take ownership of features and contribute to product decisions. The combination of equity and the chance to grow with an early-stage company is exactly what I'm looking for.

I would love to discuss how my skills and enthusiasm can contribute to your platform's success.

Best regards,
Talha Ahmed`,
      resumeUrl: "https://example.com/talha-resume.pdf",
      customMessage: "I'm available for a call anytime this week to discuss the role in detail!",
      status: ApplicationStatus.SHORTLISTED,
      matchScore: 92,
      appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    },
  });

  console.log(`✅ Created application from ${seeker.name}`);

  // Create conversation linked to the job post
  console.log("💬 Creating conversation...");
  const conversation = await prisma.conversation.create({
    data: {
      jobPostId: jobPost.id,
      participants: {
        create: [
          { userId: finder.id, lastReadAt: new Date() },
          { userId: seeker.id, lastReadAt: new Date(Date.now() - 2 * 60 * 60 * 1000) }, // 2 hours ago
        ],
      },
    },
  });

  console.log(`✅ Created conversation`);

  // Create realistic message exchange
  console.log("✉️ Creating messages...");
  
  const now = Date.now();
  const messages = [
    {
      senderId: finder.id,
      receiverId: seeker.id,
      content: `Hi Talha! I just reviewed your application for the Full Stack Developer position and I'm really impressed with your background! 🚀

Your experience with React, Next.js, and TypeScript is exactly what we're looking for. I'd love to have a conversation about the role and learn more about your projects.

Would you be available for a quick call this week?`,
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRead: true,
    },
    {
      senderId: seeker.id,
      receiverId: finder.id,
      content: `Hi Hassan! Thank you so much for reaching out! I'm really excited about this opportunity! 😊

I'd love to discuss the role in more detail. I'm available most afternoons this week. Would Tuesday or Wednesday work for you?

Also, I'd be happy to walk you through some of my projects, including the student management system I mentioned in my application.`,
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000), // 45 min later
      isRead: true,
    },
    {
      senderId: finder.id,
      receiverId: seeker.id,
      content: `Perfect! Wednesday at 3 PM works great for me. I'll send you a Google Meet link.

I'm definitely interested in seeing your projects! The student management system sounds particularly relevant since we're building an EdTech platform.

A few things to think about before our call:
1. What interests you most about EdTech?
2. What would be your ideal role in a startup?
3. Any questions you have about our platform or vision?`,
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
      isRead: true,
    },
    {
      senderId: seeker.id,
      receiverId: finder.id,
      content: `Sounds great! Wednesday at 3 PM is perfect. Looking forward to it!

To answer your questions:
1. I'm passionate about EdTech because I believe technology can make quality education accessible to everyone. During my time at UMT, I've seen how the right tools can transform learning.

2. In a startup, I'd love to wear multiple hats - contributing to both product and technical decisions. I enjoy the fast-paced environment and the ability to see direct impact.

3. I'm curious about the target audience for your platform and what specific pain points you're solving. Also, what's the tech stack you're currently using?`,
      createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 1 hour later
      isRead: true,
    },
    {
      senderId: finder.id,
      receiverId: seeker.id,
      content: `Great answers! I can tell you've really thought about this.

We're targeting university students (like yourself!) and focusing on collaborative learning and peer-to-peer knowledge sharing. Think of it as combining the best aspects of study groups with modern technology.

Our current stack:
- Frontend: Next.js 15, TypeScript, TailwindCSS
- Backend: Node.js, Prisma, PostgreSQL
- Real-time: Pusher for live features
- Auth: Better-Auth

I'll share more details on our call, including our roadmap and where you'd fit in. I think you'd be a great addition to the team!`,
      createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000 - 5 * 60 * 60 * 1000), // Yesterday evening
      isRead: true,
    },
    {
      senderId: seeker.id,
      receiverId: finder.id,
      content: `This sounds amazing! The tech stack is right in my wheelhouse - I've worked extensively with Next.js and Prisma. The collaborative learning angle is really exciting too.

I've actually built something similar as a side project. I'd love to show you how I implemented real-time collaboration features.

See you Wednesday at 3 PM! I'll prepare some questions about the product roadmap and team structure.`,
      createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000), // Yesterday
      isRead: true,
    },
    {
      senderId: finder.id,
      receiverId: seeker.id,
      content: `Hey Talha! Thanks for the great call yesterday. Really enjoyed learning about your projects and your approach to problem-solving.

The team and I discussed your application, and we'd like to move forward! We think you'd be a perfect fit for our founding team. 🎉

Are you interested? If so, let's schedule another call to discuss the details - equity split, responsibilities, timeline, etc.`,
      createdAt: new Date(now - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
    },
    {
      senderId: seeker.id,
      receiverId: finder.id,
      content: `Hassan! This is incredible news! YES, I'm absolutely interested! 🚀

I'm so excited to join the team and help build something impactful. Let's definitely schedule a follow-up call to discuss all the details.

I'm free anytime tomorrow or this weekend. What works best for you?

Thank you for this opportunity!`,
      createdAt: new Date(now - 1 * 60 * 60 * 1000), // 1 hour ago
      isRead: false,
    },
  ];

  for (const msgData of messages) {
    await prisma.message.create({
      data: {
        ...msgData,
        conversationId: conversation.id,
      },
    });
  }

  // Update conversation timestamp
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date(now - 1 * 60 * 60 * 1000) },
  });

  console.log(`✅ Created ${messages.length} messages in the conversation`);

  console.log("\n🎉 Message seeding completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`   Finder: ${finder.name} (${finder.email})`);
  console.log(`   Seeker: ${seeker.name} (${seeker.email})`);
  console.log(`   Job Post: ${jobPost.title}`);
  console.log(`   Messages: ${messages.length}`);
  console.log(`\n💡 You can now test the messaging system with these users!`);
  console.log(`   - Login as ${finderEmail} to see messages as a Finder`);
  console.log(`   - Login as ${seekerEmail} to see messages as a Seeker`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding messages:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
