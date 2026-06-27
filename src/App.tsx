import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValueEvent,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Cubes from './components/Cubes';
import CardSwap, { Card } from './components/CardSwap';
import FlowingMenu from './components/FlowingMenu';
import MobileHero from './components/MobileHero';
import ServiceModal, { type ServiceDetail } from './components/ServiceModal';
import MetallicButton from './components/MetallicButton';

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

  // Footer transforms
  const footerRawOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  const footerOpacity = useSpring(footerRawOpacity, { stiffness: 80, damping: 22 });
  const footerRawScale = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.97, 1, 1, 0.97]);
  const footerScale = useSpring(footerRawScale, { stiffness: 80, damping: 22 });

  // Regular section transforms
  const regularRawBlur = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [8, 0, 0, 0, 0, 8]
  );
  const regularBlur = useSpring(regularRawBlur, { stiffness: 80, damping: 22 });

  const regularRawOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.65, 0.85, 1],
    [0.25, 1, 1, 1, 1, 0.25]
  );
  const regularOpacity = useSpring(regularRawOpacity, { stiffness: 80, damping: 22 });

  const regularRawScale = useTransform(
    scrollYProgress,
    [0, 0.18, 0.4, 0.6, 0.82, 1],
    [0.97, 1, 1, 1, 1, 0.97]
  );
  const regularScale = useSpring(regularRawScale, { stiffness: 80, damping: 22 });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const blurFilter = useTransform(regularBlur, (v) => `blur(${v}px)`);

  if (isFooter) {
    return (
      <motion.div
        ref={ref}
        id={id}
        className={className}
        style={{ opacity: footerOpacity, scale: footerScale, transformOrigin: 'center center', willChange: 'opacity, transform' }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      style={{
        filter: isMobile ? 'none' : blurFilter,
        opacity: regularOpacity,
        scale: regularScale,
        transformOrigin: 'center center',
        willChange: isMobile ? 'opacity, transform' : 'filter, opacity, transform',
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

const services: ServiceDetail[] = [
  {
    title: 'Web Products',
    subtitle: 'Full-Stack Web Engineering',
    description: 'Scalable and performant web applications for consumers and enterprises.',
    tags: ['React', 'Next.js', 'Node.js', 'PostgreSQL'],
    cta: 'Start a web project',
    images: [
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
  },
  {
    title: 'AI Systems',
    subtitle: 'Intelligent Automation',
    description: 'Custom AI workflows and LLM integrations that fit your business logic.',
    tags: ['LLMs', 'RAG', 'Python', 'Vector DBs'],
    cta: 'Explore AI solutions',
    images: [
      'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
  },
  {
    title: 'Design Systems',
    subtitle: 'Visual & Component Architecture',
    description: 'Scalable design languages to maintain visual consistency everywhere.',
    tags: ['Figma', 'Storybook', 'Tailwind', 'Motion'],
    cta: 'Build your design system',
    images: [
      'https://images.pexels.com/photos/196645/pexels-photo-196645.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
  },
  {
    title: 'Growth Engineering',
    subtitle: 'Performance & Revenue Optimization',
    description: 'Data-driven strategies focused on conversion and retention.',
    tags: ['Analytics', 'A/B Testing', 'SEO', 'CRO'],
    cta: 'Scale your growth',
    images: [
      'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
  },
];

const stats = [
  { value: '5+', label: 'Products Shipped' },
  { value: '10k+', label: 'Users Reached' },
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
        <article className="relative overflow-hidden rounded-3xl border border-gray-200 bg-[#f4f4f4] shadow-[0_4px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_60px_rgba(0,0,0,0.1)] transition-shadow duration-500">
          {/* Image */}
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-[1.01] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f4f4f4]" />

            {/* Number watermark */}
            <div
              className="absolute top-6 right-8 font-black text-gray-200/80 select-none leading-none"
              style={{ fontSize: 'clamp(72px, 10vw, 140px)' }}
            >
              {p.num}
            </div>

            {/* Category pill */}
            <div className="absolute top-5 left-5">
              <span className="text-[9px] tracking-[0.28em] uppercase text-gray-700 bg-[#f4f4f4]/80 backdrop-blur-md border border-gray-200 rounded-full px-3.5 py-1.5">
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

const FRAME_COUNT = 202;

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      // Optimize loading by using async decoding and lower priority for later frames
      img.decoding = 'async';
      if (i > 10) {
        img.fetchPriority = 'low';
      } else {
        img.fetchPriority = 'high';
      }
      
      const paddedIndex = i.toString().padStart(3, '0');
      img.src = `/frames/frame_${paddedIndex}_delay-0.05s.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setImages(loadedImages);
        }
      };
      // To handle errors without breaking the sequence completely
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setImages(loadedImages);
        }
      };
      loadedImages.push(img);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const renderFrame = (index: number) => {
    if (!images[index] || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const img = images[index];
    if (!img.width) return; // Wait if image is broken or not fully loaded

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    // Removed scale factor to revert back to full cover
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  };

  // Initial draw
  useEffect(() => {
    if (images.length === FRAME_COUNT) {
      renderFrame(0);
    }
  }, [images]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const currentScroll = scrollYProgress.get();
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(currentScroll * FRAME_COUNT)
      );
      renderFrame(frameIndex);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [images, scrollYProgress]);

  // Scroll handler
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (images.length === 0) return;
    const frameIndex = Math.min(
      FRAME_COUNT - 1,
      Math.floor(latest * FRAME_COUNT)
    );
    requestAnimationFrame(() => renderFrame(frameIndex));
  });

  // Calculate the progress threshold for frame 50
  const frame50Progress = 50 / FRAME_COUNT;
  
  const textOpacity = useTransform(
    scrollYProgress,
    [0, frame50Progress * 0.6, frame50Progress, 1],
    [1, 1, 0, 0],
    { clamp: true }
  );
  
  const textX = useTransform(
    scrollYProgress,
    [0, frame50Progress * 0.6, frame50Progress, 1],
    [0, 0, -150, -150],
    { clamp: true }
  );

  const textFilter = useTransform(
    scrollYProgress,
    [0, frame50Progress * 0.6, frame50Progress, 1],
    ['blur(0px)', 'blur(0px)', 'blur(10px)', 'blur(10px)'],
    { clamp: true }
  );

  return (
    <>
      {/* Mobile Crazy Hero */}
      <MobileHero />

      {/* Desktop Canvas Animation */}
      <div ref={containerRef} className="hidden md:block relative w-full h-[350vh] bg-[#f4f4f4]">
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
          
          {/* Overlay Text */}
          <motion.div 
            className="absolute bottom-8 left-6 md:bottom-16 md:left-16 pointer-events-none"
            style={{ 
              opacity: textOpacity,
              x: textX,
              filter: textFilter,
            }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-[4rem] font-classic uppercase text-black leading-[0.95] tracking-tight mb-4 drop-shadow-sm">
              THE A³ COLLECTION:<br />
              ARCHITECTED FOR<br />
              EXCELLENCE
            </h1>
            <p className="text-black font-sans font-medium text-lg md:text-xl mt-4 mb-5 drop-shadow-sm">
              Nostalgic craft. Modern precision.
            </p>
            <div className="pointer-events-auto w-fit">
              <MetallicButton to="/studio">
                Learn More
              </MetallicButton>
            </div>
          </motion.div>
        </div>
        {/* Gradient fade to seamlessly transition into the next section */}
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#f4f4f4] to-transparent pointer-events-none z-10" />
      </div>
    </>
  );
}

/* ─── home page ─────────────────────────────────────── */

export default function App() {
  const [activeService, setActiveService] = useState<ServiceDetail | null>(null);

  return (
    <>
      {/* Service detail modal */}
      <ServiceModal service={activeService} onClose={() => setActiveService(null)} />

      {/* ══ HERO ══ */}
      <Hero />

      {/* ══ WORK — CardSwap section ══ */}
      <section id="work" className="relative bg-[#f4f4f4] overflow-hidden border-t border-gray-200 md:border-t-0" style={{ minHeight: '100vh' }}>
        {/* Left text */}
        <div className="relative z-10 pt-40 pb-32 px-8 md:px-16 max-w-xl">
          <Reveal variant={REVEAL_LEFT}>
            <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-5">Selected Work</p>
            <h2 className="text-6xl md:text-8xl font-classic uppercase text-black leading-[0.88] tracking-tight mb-6">
              Work that<br />
              <span className="text-gray-400">endures.</span>
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="text-gray-600 font-classic italic text-xl md:text-2xl mb-10 leading-relaxed">
              Products engineered to scale and age like architecture.
            </p>
            <a href="/work" className="group inline-flex items-center gap-3 text-black border-b border-gray-300 pb-2 text-[11px] uppercase tracking-widest hover:border-black transition-colors duration-300">
              View all projects
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </Reveal>
        </div>

        {/* CardSwap — absolutely positioned bottom-right */}
        <CardSwap
          width={600}
          height={400}
          cardDistance={65}
          verticalDistance={75}
          delay={4000}
          pauseOnHover={true}
          skewAmount={5}
          easing="elastic"
        >
          {projects.map((p) => (
            <Card key={p.num} style={{ padding: 0, overflow: 'hidden', cursor: 'default' }}>
              <div className="relative w-full h-full">
                {/* Image */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'brightness(0.45) grayscale(0.3)' }}
                />
                {/* Top tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="text-[9px] tracking-[0.28em] uppercase text-white/80 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 backdrop-blur-sm">
                    {p.category}
                  </span>
                </div>
                {/* Number watermark */}
                <div
                  className="absolute top-2 right-5 font-classic text-white/10 select-none leading-none"
                  style={{ fontSize: 'clamp(60px, 8vw, 110px)' }}
                >
                  {p.num}
                </div>
                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-10">
                  <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest mb-1.5">{p.year}</p>
                  <h3 className="text-2xl md:text-3xl font-classic uppercase text-white leading-tight">{p.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[8px] tracking-[0.2em] uppercase text-white/40 border border-white/15 rounded-full px-2 py-0.5">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </CardSwap>
      </section>

      {/* ══ STUDIO / A³ COLLECTION ══ */}
      <SectionBlur id="studio" className="relative py-32 px-8 md:px-16 border-t border-gray-200 overflow-hidden bg-[#f4f4f4]">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-20 items-center relative z-10">
          <div>
            <Reveal variant={REVEAL_LEFT} delay={0}>
              <h2 className="text-5xl md:text-7xl font-classic uppercase leading-tight tracking-tight mb-6 text-black">
                THE A³ COLLECTION:<br />
                ARCHITECTED FOR<br />
                EXCELLENCE
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="text-black text-xl md:text-2xl leading-relaxed max-w-lg font-classic italic mb-8">
                Nostalgic craft. Modern precision.
              </p>
              <a href="/studio" className="inline-flex items-center justify-center px-8 py-4 bg-black text-white rounded-full font-semibold uppercase text-sm tracking-widest hover:bg-gray-800 active:scale-95 transition-all duration-300">
                Learn More
              </a>
            </Reveal>
          </div>

          <div className="w-full">
            <Reveal variant={REVEAL_RIGHT} delay={100} className="w-full">
              <div className="w-full aspect-square max-w-[480px] mx-auto overflow-hidden">
                <Cubes gridSize={8} faceColor="#f4f4f4" borderStyle="1px solid #000" rippleColor="#000" autoAnimate={true} rippleOnClick={true} />
              </div>
            </Reveal>
          </div>
        </div>
      </SectionBlur>

      {/* ══ SERVICES FLOWING MENU ══ */}
      <section className="relative overflow-hidden border-t border-gray-200">
        <div style={{ height: '500px', width: '100%' }}>
          <FlowingMenu
            items={services.map((s, i) => ({
              link: '#',
              text: s.title,
              image: s.images[0],
              onClick: () => setActiveService(s),
            }))}
            bgColor="#f4f4f4"
            textColor="#000"
            marqueeBgColor="#000"
            marqueeTextColor="#fff"
            borderColor="rgba(0,0,0,0.1)"
          />
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="relative py-32 px-8 md:px-16 overflow-hidden bg-[#f4f4f4] text-black border-t border-gray-200">
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          <Reveal delay={0}>
            <h2 className="text-4xl md:text-6xl font-classic uppercase tracking-tight mb-4 text-black">
              Let's build something iconic.
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-12">
              <MetallicButton to="/contact">
                Start a project
              </MetallicButton>
              <span className="text-sm text-gray-600 font-classic">officialA3Productions@gmail.com</span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}


