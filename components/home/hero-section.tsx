import { BinaryParticleBackground } from "@/components/home/binary-particle-background"
import { ReleaseAction } from "@/components/home/release-action"
import styles from "./hero-section.module.css"

export function HeroSection({ initialRemainingSeconds }: { initialRemainingSeconds: number }) {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-[#F7F8FA] px-4 py-20 text-center sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#101f360a_1px,transparent_1px),linear-gradient(to_bottom,#101f360a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_65%_at_50%_50%,#000_65%,transparent_100%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C6A24B]/15 blur-[100px]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
        <BinaryParticleBackground />
      </div>

      <div className="relative z-10 flex max-w-4xl flex-col items-center">
        <h1 className={`${styles.headingEnter} font-heading text-4xl font-bold leading-tight tracking-tight text-[#101F36] text-balance sm:text-6xl lg:text-7xl`}>
          Una decisión, <span className={styles.gradientWords}>una comunidad.</span>
        </h1>
        <ReleaseAction initialRemainingSeconds={initialRemainingSeconds} />
      </div>
    </section>
  )
}
