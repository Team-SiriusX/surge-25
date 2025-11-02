import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import { GlobeSection } from "@/components/sections/globe-section";
import { FeaturesSection } from "@/components/sections/features-section";
import { GeminiSection } from "@/components/sections/gemini-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { FooterSection } from "@/components/sections/footer-section";

export default function Home() {
  return (
    <>
      <div className="relative flex min-h-screen w-full overflow-hidden rounded-md bg-black/[0.96] antialiased items-center justify-center">
        {/* Grid Background */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 select-none",
            "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
            "[background-size:20px_20px] sm:[background-size:30px_30px] md:[background-size:40px_40px]"
          )}
        />

        {/* Spotlight Effect */}
        <Spotlight
          className="-top-20 left-1/2 -translate-x-1/2 sm:-top-32 sm:left-0 sm:translate-x-0 md:-top-20 md:left-60"
          fill="white"
        />
        <Spotlight
          className="-top-20 right-1/2 translate-x-1/2 sm:-top-32 sm:right-0 sm:translate-x-0 md:-top-20 md:right-60"
          fill="white"
          mirror={true}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 md:px-12 md:py-0">
          <h1 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold leading-[1.15] text-transparent sm:text-5xl sm:leading-[1.15] md:text-6xl md:leading-[1.15] lg:text-7xl lg:leading-[1.1]">
            UniConnect<br />
            is the new trend.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base font-normal leading-relaxed text-neutral-300 sm:mt-8 sm:text-lg sm:leading-relaxed md:text-xl md:leading-relaxed">
            Connect with opportunities, collaborate on projects, and build your career right from campus. Join thousands of students finding internships, startup roles, and academic collaborations through our AI-powered marketplace.
          </p>
        </div>
      </div>
      
      {/* Globe Section */}
      <GlobeSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Gemini Effect Section */}
      <GeminiSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Footer */}
      <FooterSection />
    </>
  );
}
