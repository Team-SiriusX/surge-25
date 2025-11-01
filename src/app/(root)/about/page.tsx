import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import { Users, Target, Sparkles, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <div className="relative flex min-h-screen w-full overflow-hidden rounded-md bg-black/[0.96] antialiased md:items-center md:justify-center">
        {/* Grid Background */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 select-none [background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
          )}
        />

        {/* Spotlight Effect */}
        <Spotlight
          className="-top-40 left-0 md:-top-20 md:left-60"
          fill="white"
        />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-32">
          <h1 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
            About UniConnect
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg font-normal text-neutral-300">
            Empowering students to discover opportunities and build meaningful careers right from campus.
          </p>

          {/* Mission Section */}
          <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm transition-all hover:border-neutral-700">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800/50">
                <Target className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-neutral-100">Our Mission</h3>
              <p className="text-sm text-neutral-400">
                To bridge the gap between student talent and campus opportunities through intelligent matching and seamless connections.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm transition-all hover:border-neutral-700">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800/50">
                <Users className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-neutral-100">Community First</h3>
              <p className="text-sm text-neutral-400">
                Building a vibrant ecosystem where students, startups, and academic projects come together to create impact.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm transition-all hover:border-neutral-700">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800/50">
                <Sparkles className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-neutral-100">AI-Powered</h3>
              <p className="text-sm text-neutral-400">
                Leveraging cutting-edge AI technology to provide personalized recommendations and smart matching for every student.
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50 p-6 backdrop-blur-sm transition-all hover:border-neutral-700">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-800/50">
                <Heart className="h-6 w-6 text-neutral-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-neutral-100">Student Success</h3>
              <p className="text-sm text-neutral-400">
                Committed to helping every student discover their potential and launch successful careers through meaningful opportunities.
              </p>
            </div>
          </div>

          {/* Story Section */}
          <div className="mx-auto mt-20 max-w-3xl">
            <h2 className="mb-6 text-center text-3xl font-bold text-neutral-100 md:text-4xl">
              Our Story
            </h2>
            <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 backdrop-blur-sm">
              <p className="text-neutral-300 leading-relaxed">
                UniConnect was born from a simple observation: talented students and exciting opportunities exist on every campus, but they rarely find each other efficiently. Traditional job boards weren't designed for the unique dynamics of campus life, where academic projects, startup collaborations, and internships intersect.
              </p>
              <p className="text-neutral-300 leading-relaxed">
                We built UniConnect to change that. Our platform understands the student journey and uses intelligent matching to connect the right opportunities with the right people. Whether you're looking to join a research project, contribute to a startup, or land your dream internship, UniConnect makes it happen.
              </p>
              <p className="text-neutral-300 leading-relaxed">
                Today, we're proud to serve thousands of students across campuses, helping them discover opportunities, build their portfolios, and launch careers they're passionate about. Our AI-powered platform learns from every connection, getting smarter and more effective with each match.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20 grid gap-6 md:grid-cols-3 pb-20">
            <div className="text-center">
              <div className="mb-2 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
                10K+
              </div>
              <p className="text-neutral-400">Active Students</p>
            </div>
            <div className="text-center">
              <div className="mb-2 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
                500+
              </div>
              <p className="text-neutral-400">Opportunities Posted</p>
            </div>
            <div className="text-center">
              <div className="mb-2 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
                95%
              </div>
              <p className="text-neutral-400">Match Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
