import {
  ArrowDownRight,
  ArrowUpRight,
  Braces,
  Code2,
  GitBranch,
  LineChart,
  Mail,
  MapPin,
  type LucideIcon
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import data from "@/data/portfolio.json";

const contactIcons: Record<string, LucideIcon> = {
  mail: Mail,
  linkedin: LineChart,
  leetcode: Code2,
  github: GitBranch
};

function CountUp({ value, suffix }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1500;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref}>
      {display}
      <i>{suffix}</i>
    </span>
  );
}

const MARQUEE_SPEED = 20;

function Marquee({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const phraseRef = useRef<HTMLSpanElement>(null);
  const [layout, setLayout] = useState({ copies: 2, duration: 24 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => {
      const phraseWidth = phraseRef.current?.offsetWidth;
      if (!phraseWidth) return;
      const copies = Math.ceil(container.offsetWidth / phraseWidth) + 1;
      setLayout({ copies, duration: (copies * phraseWidth) / MARQUEE_SPEED });
    };
    const observer = new ResizeObserver(update);
    observer.observe(container);
    update();
    return () => observer.disconnect();
  }, [text]);

  const group = (hidden: boolean) => (
    <span aria-hidden={hidden || undefined}>
      {Array.from({ length: layout.copies }, (_, i) => (
        <span key={i} ref={!hidden && i === 0 ? phraseRef : undefined}>
          {text}
        </span>
      ))}
    </span>
  );

  return (
    <div
      ref={containerRef}
      className="marquee border-y border-border py-4 font-mono text-xs uppercase tracking-widest text-muted-foreground"
    >
      <div style={{ animationDuration: `${layout.duration}s` }}>
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}

function HighlightList({
  items,
  className = ""
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={`highlight-list ${className}`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function App() {
  const [progress, setProgress] = useState(0);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const onScroll = () => {
      const available =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(available > 0 ? window.scrollY / available : 0);
    };
    const onPointer = (event: PointerEvent) =>
      setPointer({ x: event.clientX, y: event.clientY });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <div
        className="pointer-orb"
        style={{ transform: `translate3d(${pointer.x}px, ${pointer.y}px, 0)` }}
      />
      <div
        className="fixed left-0 top-0 z-50 h-1 bg-primary transition-[width] duration-150"
        style={{ width: `${progress * 100}%` }}
      />

      <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between px-5 md:px-10">
          <a
            href="#top"
            className="font-mono text-xs font-medium uppercase tracking-widest"
          >
            <span className="text-primary">{data.profile.initials}</span> /
            PORTFOLIO
          </a>
          <nav className="hidden items-center gap-7 font-mono text-[11px] uppercase tracking-widest text-muted-foreground md:flex">
            <a className="nav-link" href="#skills">
              Skills
            </a>
            <a className="nav-link" href="#experience">
              Experience
            </a>
            <a className="nav-link" href="#projects">
              Projects
            </a>
          </nav>
          <Button asChild variant="portfolio" size="sm">
            <a href="#contact">
              Let’s talk <ArrowUpRight />
            </a>
          </Button>
        </div>
      </header>

      <main id="top">
        <section className="relative mx-auto flex min-h-[92vh] max-w-[1480px] flex-col justify-end px-5 pb-14 pt-28 md:px-10 md:pb-20">
          <div className="hero-grid" />
          <div className="relative z-10 mb-auto flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="status-dot" /> {data.profile.status}
            </span>
            <span className="hidden md:block">{data.profile.location}</span>
          </div>
          <div className="relative z-10">
            <p className="reveal-up mb-5 font-mono text-xs uppercase tracking-widest text-primary">
              {data.profile.role}
            </p>
            <h1 className="hero-title reveal-up delay-1">
              {data.profile.firstName}
              <br />
              <span>{data.profile.lastName}</span>
              <i>.</i>
            </h1>
            <div className="mt-8 grid gap-8 border-t border-border pt-6 md:grid-cols-[1fr_1fr] md:items-end">
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                {data.profile.tagline}
              </p>
              <a
                href="#projects"
                className="group ml-auto flex items-center gap-4 font-mono text-xs uppercase tracking-widest"
              >
                {data.profile.cta}{" "}
                <span className="grid size-12 place-items-center border border-border transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowDownRight />
                </span>
              </a>
            </div>
          </div>
        </section>

        <Marquee text={data.marquee} />

        <section
          id="skills"
          className="section-shell grid gap-12 lg:grid-cols-[.7fr_1.3fr]"
        >
          <div>
            <p className="eyebrow">01 / CAPABILITIES</p>
            <h2 className="section-title">
              Tools are temporary.
              <br />
              <span>Thinking scales.</span>
            </h2>
          </div>
          <div className="border-t border-border">
            {data.skills.map((skill, index) => (
              <div key={skill} className="skill-row group">
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-2xl font-semibold md:text-4xl">
                  {skill}
                </span>
                <Braces className="text-primary opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </section>

        <section id="capabilities" className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="eyebrow">02 / TRACK RECORD</p>
              <h2 className="section-title">
                Proof over
                <br />
                <span>promises.</span>
              </h2>
            </div>
            <p className="max-w-lg self-end leading-relaxed text-muted-foreground">
              More than a stack list: I ship end-to-end products, solve problems
              with strong DSA fundamentals, and bring the mindset that makes
              teams move faster.
            </p>
          </div>
          <div className="stat-grid mt-14">
            {data.stats.map((stat) => (
              <div key={stat.label} className="stat-card group">
                <span className="stat-number">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </span>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-primary">
                  {stat.label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t border-border pt-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Beyond the code
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {data.traits.map((trait) => (
                <span key={trait} className="trait-chip">
                  {trait}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section
          id="experience"
          className="section-shell border-y border-border"
        >
          <p className="eyebrow">03 / EXPERIENCE</p>
          <div className="mt-10">
            {data.experience.map((item, index) => (
              <article key={item.period} className="experience-row">
                <span className="font-mono text-xs text-primary">
                  {item.period}
                </span>
                <div>
                  <h3 className="text-2xl font-semibold md:text-4xl">
                    {item.role}
                  </h3>
                  <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {item.company}
                  </p>
                </div>
                <HighlightList items={item.highlights} className="max-w-lg" />
                <span className="hidden font-mono text-xs text-muted-foreground lg:block">
                  0{index + 1}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="section-shell">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <p className="eyebrow">04 / SELECTED WORK</p>
              <h2 className="section-title">
                Things I’ve <span>built.</span>
              </h2>
            </div>
            <Code2 className="hidden size-10 text-primary md:block" />
          </div>
          <div className="project-grid">
            {data.projects.map((project) => (
              <article key={project.id} className="project-card group">
                <div className="project-visual">
                  <span className="project-number">{project.id}</span>
                  <div className="project-lines" />
                  <ArrowUpRight className="absolute right-5 top-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <div className="p-6">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-primary">
                    {project.type}
                  </p>
                  <h3 className="mt-3 text-3xl font-semibold">
                    {project.title}
                  </h3>
                  <HighlightList items={project.highlights} className="mt-4" />
                  <p className="mt-6 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">
                    {project.stack}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="contact-band">
          <div className="mx-auto max-w-[1480px] px-5 py-20 md:px-10 md:py-28">
            <p className="eyebrow">05 / CONTACT</p>
            <h2 className="contact-title">
              HAVE A HARD
              <br />
              PROBLEM?
            </h2>
            <div className="mt-10 grid gap-8 border-t border-primary-foreground/25 pt-6 md:grid-cols-2">
              <p className="max-w-lg text-primary-foreground/70">
                {data.contact.intro}
              </p>
              <div className="flex flex-wrap gap-3 md:justify-end">
                {data.contact.links.map((link) => {
                  const Icon = contactIcons[link.icon];
                  const external = !link.url.startsWith("mailto:");
                  return (
                    <Button
                      key={link.label}
                      asChild
                      variant="portfolioOutline"
                      className="border-primary-foreground/30 text-primary-foreground hover:border-primary-foreground hover:text-primary-foreground"
                    >
                      <a
                        href={link.url}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noreferrer" : undefined}
                      >
                        <Icon /> {link.label}
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-4 border-t border-border px-5 py-7 font-mono text-[10px] uppercase tracking-widest text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10">
        <span>{data.footer.copyright}</span>
        <span className="flex items-center gap-2">
          <MapPin className="size-3" /> {data.footer.location}
        </span>
        <span>{data.footer.note}</span>
      </footer>
    </div>
  );
}
