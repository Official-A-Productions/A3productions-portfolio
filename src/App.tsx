import {
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, ExternalLink, ChevronRight } from 'lucide-react';

/* ─── section blur wrapper ─────────────────────────── */

function SectionBlur({
  children,
  id,
  className = '',
  isFooter = false,
}: {
  children: React.ReactNode;
  id?: string;
  className?: string;
  isFooter?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Each section tracks its own scroll progress through the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // For footer, no blur — just fade/scale
  if (isFooter) {
    const rawOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
    const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 22 });
    const rawScale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.97, 1, 1, 0.97]);
    const scale = useSpring(rawScale, { stiffness: 80, damping: 22 });

    return (
      <motion.div
        ref={ref}
        id={id}
        className={className}
        style={{ opacity, scale, transformOrigin: 'center center', willChange: 'opacity, transform' }}
      >
        {children}
      </motion.div>
    );
  }

  // Regular sections: blur only near viewport edges
  const rawBlur = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [8, 0, 0, 0, 0, 8]
  );
  const blur = useSpring(rawBlur, { stiffness: 80, damping: 22 });

  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.65, 0.85, 1],
    [0.25, 1, 1, 1, 1, 0.25]
  );
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 22 });

  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.4, 0.6, 0.82, 1],
    [0.97, 1, 1, 1, 1, 0.97]
  );
  const scale = useSpring(rawScale, { stiffness: 80, damping: 22 });

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      style={{
        filter: useTransform(blur, (v) => `blur(${v}px)`),
        opacity,
        scale,
        transformOrigin: 'center center',
        willChange: 'filter, opacity, transform',
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── staggered reveal ──────────────────────────────── */

const REVEAL_UP = {
  hidden: { opacity: 0, y: 52, filter: 'blur(12px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
  },
};

const REVEAL_LEFT = {
  hidden: { opacity: 0, x: -60, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const REVEAL_RIGHT = {
  hidden: { opacity: 0, x: 60, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const REVEAL_SCALE = {
  hidden: { opacity: 0, scale: 0.92, y: 28, filter: 'blur(14px)' },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
};

function Reveal({
  children,
  variant = REVEAL_UP,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  variant?: typeof REVEAL_UP;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variant}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ ...variant.show.transition, delay: delay / 1000 } as never}
    >
      {children}
    </motion.div>
  );
}

/* ─── data ──────────────────────────────────────────── */

const projects = [
  {
    num: '01',
    title: 'Meridian',
    category: 'SaaS Platform',
    tags: ['Web App', 'AI', 'Analytics'],
    desc: 'End-to-end business intelligence platform with real-time dashboards and predictive analytics for enterprise clients.',
    year: '2025',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    num: '02',
    title: 'Strata',
    category: 'E-Commerce System',
    tags: ['Commerce', 'Automation', 'Scale'],
    desc: 'Custom headless commerce architecture serving 2M+ monthly transactions with sub-100ms response times.',
    year: '2025',
    image: 'https://images.pexels.com/photos/5632381/pexels-photo-5632381.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    num: '03',
    title: 'Vanta AI',
    category: 'AI Product',
    tags: ['LLM', 'Automation', 'API'],
    desc: 'Proprietary AI workflow engine that automated 80% of manual operations for a Fortune 500 logistics company.',
    year: '2024',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    num: '04',
    title: 'Nocturne',
    category: 'Creative Platform',
    tags: ['Media', 'Web', 'CMS'],
    desc: 'Next-generation content platform for independent publishers — built for speed, built for scale.',
    year: '2024',
    image: 'https://images.pexels.com/photos/3585088/pexels-photo-3585088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

const services = [
  { num: '01', title: 'Web Products', desc: 'Full-stack web applications engineered for scale, speed, and long-term maintainability.' },
  { num: '02', title: 'AI Systems', desc: 'Custom LLM integrations, automation pipelines, and intelligent data workflows.' },
  { num: '03', title: 'Design Systems', desc: 'Component libraries and design systems that unify product experience at every touchpoint.' },
  { num: '04', title: 'Growth Engineering', desc: 'Performance, analytics, and conversion infrastructure that compounds over time.' },
];

const stats = [
  { value: '40+', label: 'Products Shipped' },
  { value: '12M+', label: 'Users Reached' },
  { value: '$2B+', label: 'Client Revenue' },
  { value: '6', label: 'Years Operating' },
];

/* ─── cascading card stack ──────────────────────────── */

function CascadingCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const totalCards = projects.length;

  return (
    <div ref={containerRef} style={{ height: `${(totalCards + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-5xl mx-auto px-8 md:px-16 h-full flex items-center justify-center">
          {projects.map((p, i) => (
            <CascadeCard
              key={p.num}
              project={p}
              index={i}
              total={totalCards}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CascadeCard({
  project: p,
  index,
  total,
  scrollYProgress,
}: {
  project: typeof projects[number];
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  // Each card gets an equal slice of scroll progress.
  // Card i is "active" from progress (i/total) to ((i+1)/total).
  // Within that slice: first 40% = resting visible, last 60% = peeling away.
  // Before its active slice: card is stacked with offset.
  // After its active slice: card is gone.

  const sliceStart = index / total;
  const sliceEnd = (index + 1) / total;
  const peelPoint = sliceStart + (sliceEnd - sliceStart) * 0.4;

  // Before sliceStart: card is stacked behind (offset down + slight scale down)
  // sliceStart → peelPoint: card is fully visible, stationary
  // peelPoint → sliceEnd: card peels away with rotation + translation

  const isEven = index % 2 === 0;
  const peelX = isEven ? -300 : 300;
  const peelRotate = isEven ? -8 : 8;

  const y = useTransform(
    scrollYProgress,
    [0, sliceStart, peelPoint, sliceEnd, 1],
    [12 * (total - index), 0, 0, -200, -200]
  );

  const x = useTransform(
    scrollYProgress,
    [0, sliceStart, peelPoint, sliceEnd, 1],
    [0, 0, 0, peelX, peelX]
  );

  const rotate = useTransform(
    scrollYProgress,
    [0, sliceStart, peelPoint, sliceEnd, 1],
    [0, 0, 0, peelRotate, peelRotate]
  );

  const scale = useTransform(
    scrollYProgress,
    [0, sliceStart, peelPoint, sliceEnd, 1],
    [0.96, 1, 1, 0.88, 0.88]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, sliceStart, peelPoint, sliceEnd, 1],
    [1, 1, 1, 0, 0]
  );

  const springConfig = { stiffness: 120, damping: 30 };
  const springY = useSpring(y, springConfig);
  const springX = useSpring(x, springConfig);
  const springRotate = useSpring(rotate, springConfig);
  const springScale = useSpring(scale, springConfig);
  const springOpacity = useSpring(opacity, { stiffness: 200, damping: 30 });

  // Top card = highest z-index (index 0 is on top)
  const zIndex = total - index;

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        y: springY,
        x: springX,
        rotate: springRotate,
        scale: springScale,
        opacity: springOpacity,
        zIndex,
        willChange: 'transform, opacity',
        transformOrigin: 'center 90%',
      }}
    >
      <div className="w-full max-w-4xl group cursor-default">
        <article className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_4px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_60px_rgba(0,0,0,0.1)] transition-shadow duration-500">
          {/* Image */}
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-[1.01] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white" />

            {/* Number watermark */}
            <div
              className="absolute top-6 right-8 font-black text-gray-200/80 select-none leading-none"
              style={{ fontSize: 'clamp(72px, 10vw, 140px)' }}
            >
              {p.num}
            </div>

            {/* Category pill */}
            <div className="absolute top-5 left-5">
              <span className="text-[9px] tracking-[0.28em] uppercase text-gray-700 bg-white/80 backdrop-blur-md border border-gray-200 rounded-full px-3.5 py-1.5">
                {p.category}
              </span>
            </div>

            {/* Hover action */}
            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-1 group-hover:translate-y-0">
              <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center shadow-lg">
                <ExternalLink size={13} className="text-white" />
              </div>
            </div>
          </div>

          {/* Info bar */}
          <div className="px-8 py-6 flex items-end justify-between">
            <div>
              <h3 className="text-3xl md:text-4xl font-black tracking-tight text-black">{p.title}</h3>
              <p className="text-sm text-gray-500 mt-1.5 max-w-md leading-relaxed">{p.desc}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0 ml-6">
              <span className="text-[10px] text-gray-400 font-mono">{p.year}</span>
              <div className="flex flex-wrap gap-1.5 justify-end">
                {p.tags.map((tag) => (
                  <span key={tag} className="text-[8px] tracking-[0.2em] uppercase text-gray-500 border border-gray-200 rounded-full px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400" />
        </article>
      </div>
    </motion.div>
  );
}

/* ─── hero ──────────────────────────────────────────── */

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const logoY = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Hero section itself blurs out as user scrolls away
  const heroBlur = useTransform(scrollYProgress, [0, 0.6, 1], [0, 0, 16]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55, 1], [1, 1, 0.1]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen flex flex-col overflow-hidden bg-white"
      style={{
        filter: useTransform(heroBlur, (v) => `blur(${v}px)`),
        opacity: heroOpacity,
        willChange: 'filter, opacity',
      }}
    >
      {/* Cursor glow */}
      <div ref={cursorRef} className="cursor-glow hidden lg:block" />

      {/* Ambient haze */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 65% 38%, rgba(99,102,241,0.08) 0%, rgba(59,130,246,0.05) 38%, rgba(168,85,247,0.04) 65%, transparent 100%)' }} />

      {/* Large logo — right side */}
      <motion.div
        className="absolute right-0 bottom-0 pointer-events-none"
        style={{
          width: 'clamp(380px, 54vw, 820px)',
          y: logoY,
          opacity: logoOpacity,
          scale: logoScale,
          transformOrigin: 'bottom right',
        }}
      >
        <img src="/image.png" alt="" className="w-full h-auto object-contain select-none filter invert" draggable={false} />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white to-transparent" />
      </motion.div>

      {/* Text block */}
      <motion.div
        className="relative z-10 flex flex-col justify-center flex-1 px-8 md:px-16 pt-32 pb-32"
        style={{ y: textY, opacity: textOpacity }}
      >
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 60, filter: 'blur(16px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-black uppercase leading-[0.82] tracking-tighter text-black"
            style={{ fontSize: 'clamp(56px, 8.5vw, 128px)' }}
          >
            We<br />
            Scale<br />
            <span className="holo-text-light">Systems.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 text-lg sm:text-xl text-gray-600 max-w-2xl font-light leading-relaxed"
          >
            Purpose-built software for ambitious companies.
          </motion.div>

          <motion.a
            href="#work"
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 inline-flex flex-col gap-3 group"
          >
            <span className="text-[10px] tracking-[0.35em] uppercase text-gray-500 font-medium">Explore Work</span>
            <div className="w-9 h-9 border border-gray-300 rounded-full flex items-center justify-center group-hover:border-gray-900 group-hover:bg-gray-100 transition-all duration-400">
              <ArrowDownRight size={14} className="text-gray-600 group-hover:text-black transition-colors" />
            </div>
          </motion.a>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        className="relative z-10 border-t border-gray-200 px-8 md:px-16 py-5 flex items-center justify-between"
        style={{ opacity: textOpacity }}
      >
        <span className="text-[9px] tracking-[0.22em] uppercase text-gray-400">For Ambitious Brands</span>
        <div className="hidden sm:block">
          <img src="/image.png" alt="A3" className="h-5 w-auto object-contain opacity-40 filter invert" />
        </div>
        <span className="text-[9px] tracking-[0.15em] uppercase text-gray-400">© A³ Productions</span>
      </motion.div>
    </motion.section>
  );
}

/* ─── app ───────────────────────────────────────────── */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 80], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.92)']);
  const navBorder = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.08)']);

  return (
    <div className="relative bg-white text-black overflow-x-hidden">
      {/* Grain */}
      <div className="grain-overlay-light" />

      {/* NAV */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-14 py-6"
        style={{
          backgroundColor: navBg,
          borderBottom: useTransform(navBorder, (c) => `1px solid ${c}`),
          backdropFilter: useTransform(scrollY, [0, 80], ['blur(0px)', 'blur(12px)']),
        } as never}
      >
        <a href="#" className="flex items-center gap-3">
          <img src="/image.png" alt="A3 Productions" className="h-8 w-auto object-contain filter invert" />
          <div className="w-px h-4 bg-gray-300" />
          <span className="text-gray-700 text-[10px] tracking-[0.3em] uppercase font-medium">Productions</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {['Work', 'Studio', 'Services', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="nav-link-light text-[11px] tracking-[0.22em] uppercase text-gray-600 hover:text-black transition-colors duration-300">
              {item}
            </a>
          ))}
        </div>

        <button className="md:hidden p-1" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="flex flex-col gap-1.5">
            <span className={`w-5 h-px bg-black transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`w-5 h-px bg-black transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-px bg-black transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 py-10 px-8 flex flex-col gap-8 md:hidden"
            >
              {['Work', 'Studio', 'Services', 'Contact'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-3xl font-black tracking-tight text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ══ HERO ══ */}
      <Hero />

      {/* ══ TICKER ══ */}
      <SectionBlur className="border-y border-gray-200 py-4 overflow-hidden bg-white">
        <div className="ticker-track flex items-center whitespace-nowrap">
          {Array(6).fill(['Web Products', 'AI Systems', 'Automation', 'Scale', 'Software Engineering', 'Product Design']).flat().map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="text-[10px] tracking-[0.32em] uppercase text-gray-400 px-8">{item}</span>
              <span className="text-gray-300">✦</span>
            </span>
          ))}
        </div>
      </SectionBlur>

      {/* ══ STATS ══ */}
      <SectionBlur className="relative py-32 px-8 md:px-16 border-b border-gray-200 overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 80% at 15% 50%, rgba(59,130,246,0.04) 0%, transparent 70%)' }} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-16 relative z-10">
          {stats.map((s, i) => (
            <Reveal key={i} delay={i * 70}>
              <div>
                <div className="text-6xl md:text-7xl font-black tracking-tight text-black mb-2 leading-none">{s.value}</div>
                <div className="text-[9px] tracking-[0.3em] uppercase text-gray-500 font-medium">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </SectionBlur>

      {/* ══ WORK ══ */}
      <section id="work" className="relative bg-white">
        <div className="py-28 px-8 md:px-16">
          <div className="flex items-end justify-between mb-0 relative z-10">
            <div>
              <Reveal variant={REVEAL_LEFT} delay={0}>
                <h2 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.85]">
                  <span className="text-gray-400">Work</span>
                </h2>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Cascading card stack */}
        <CascadingCards />
      </section>

      {/* ══ SERVICES ══ */}
      <SectionBlur id="services" className="relative py-28 px-8 md:px-16 border-t border-gray-200 overflow-hidden bg-white">
        <div className="absolute left-0 top-1/3 w-1/2 h-1/2 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 65% 55% at 10% 50%, rgba(59,130,246,0.04) 0%, transparent 70%)' }} />

        <div className="mb-16 relative z-10">
          <Reveal variant={REVEAL_LEFT} delay={0}>
            <h2 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.85]">
              <span className="text-gray-400">Services</span>
            </h2>
          </Reveal>
        </div>

        <div className="divide-y divide-gray-200 relative z-10">
          {services.map((s, i) => (
            <Reveal key={s.num} delay={i * 80}>
              <div className="group flex items-start sm:items-center justify-between py-9 hover:pl-5 transition-all duration-400 cursor-default">
                <div className="flex items-start sm:items-center gap-6 sm:gap-10">
                  <span className="text-[10px] text-gray-400 font-mono w-5 shrink-0 mt-1 sm:mt-0">{s.num}</span>
                  <div>
                    <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-black group-hover:text-gray-700 transition-colors duration-300">{s.title}</h3>
                    <p className="service-desc text-sm text-gray-600 mt-1.5 max-w-md leading-relaxed">{s.desc}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1.5 transition-all duration-400 shrink-0 ml-6" />
              </div>
            </Reveal>
          ))}
        </div>
      </SectionBlur>

      {/* ══ STUDIO ══ */}
      <SectionBlur id="studio" className="relative py-32 px-8 md:px-16 border-t border-gray-200 overflow-hidden bg-white">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <Reveal variant={REVEAL_LEFT} delay={0}>
              <h2 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.85] mb-10">
                <span className="holo-text-light">Built</span><br />
                <span className="text-gray-400">to Last</span>
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="text-gray-700 text-lg leading-relaxed max-w-lg font-light">
                Engineering that compounds. Systems designed to grow with your business.
              </p>
            </Reveal>
          </div>

          <Reveal variant={REVEAL_RIGHT} delay={100}>
            <div className="relative aspect-square max-w-sm mx-auto md:ml-auto">
              <div className="absolute inset-0 rounded-3xl"
                style={{ background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
              <div className="relative z-10 flex items-center justify-center h-full">
                <img src="/image.png" alt="A3 Productions" className="w-3/4 h-auto object-contain filter invert" />
              </div>
            </div>
          </Reveal>
        </div>
      </SectionBlur>

      {/* ══ CTA ══ */}
      <SectionBlur id="contact" className="relative py-44 px-8 md:px-16 overflow-hidden border-t border-gray-200 bg-white">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 60%, rgba(99,102,241,0.07) 0%, rgba(59,130,246,0.05) 40%, transparent 70%)' }} />

        <div className="relative z-10 max-w-5xl">
          <Reveal delay={0}>
            <h2
              className="font-black uppercase leading-[0.85] tracking-tighter text-black mb-10"
              style={{ fontSize: 'clamp(56px, 9vw, 140px)' }}
            >
              Ready to<br />
              <span className="holo-text-light">Build?</span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <a href="mailto:hello@a3productions.io"
                className="group inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-semibold text-sm tracking-wide hover:bg-gray-900 active:scale-95 transition-all duration-300">
                <span>Get In Touch</span>
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <span className="text-sm text-gray-600">hello@a3productions.io</span>
            </div>
          </Reveal>
        </div>
      </SectionBlur>

      {/* ══ FOOTER ══ */}
      <SectionBlur isFooter={true} className="border-t border-gray-200 px-8 md:px-16 py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-white">
        <a href="#" className="flex items-center gap-3">
          <img src="/image.png" alt="A3" className="h-6 w-auto object-contain opacity-50 hover:opacity-80 transition-opacity filter invert" />
          <div className="w-px h-4 bg-gray-300" />
          <span className="text-gray-700 text-[10px] tracking-[0.3em] uppercase font-medium">Productions</span>
        </a>
        <div className="flex items-center gap-8">
          {['Twitter', 'LinkedIn', 'Dribbble'].map((s) => (
            <a key={s} href="#" className="text-[10px] tracking-[0.22em] uppercase text-gray-500 hover:text-black transition-colors duration-300">{s}</a>
          ))}
        </div>
        <span className="text-[10px] tracking-[0.15em] uppercase text-gray-500">© 2025 A³</span>
      </SectionBlur>
    </div>
  );
}
