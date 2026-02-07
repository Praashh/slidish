import Image from "next/image";
import Hero from "@/app/_components/hero";
import Navbar from "@/components/navbar";
import Footer from "@/app/_components/footer";

export default function Home() {
  return (
    <main className="min-h-screen relative bg-[#faf9f6]">
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0">
          <Image
            src="/feature-astronaut.png"
            alt="Astronaut in a field looking at the horizon"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-white/90" />
          <div className="absolute inset-0 bg-radial-at-t from-orange-100/10 via-transparent to-transparent opacity-60" />
        </div>

        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] rounded-full bg-orange-200/20 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[40%] rounded-full bg-blue-100/10 blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Footer />
      </div>
    </main>
  );
}

