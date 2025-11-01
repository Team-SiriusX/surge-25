import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";

export default function Home() {
  return (
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
      <Spotlight
        className="-top-40 right-0 md:-top-20 md:right-60"
        fill="white"
        mirror={true}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl p-4 pt-20 md:pt-0">
        <h1 className="bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
          Uni Connect <br /> is the new trend.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-center text-base font-normal text-neutral-300">
         Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae sequi quibusdam molestias exercitationem debitis dolorum! Inventore quas, minus ea eveniet qui, fuga officiis beatae labore vel aperiam libero veritatis a atque, dolorem ad quis at!
        </p>
      </div>
    </div>
  );
}
