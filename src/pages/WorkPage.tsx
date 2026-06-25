import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

/* ─── reveal ──────────────────────────────── */
const REVEAL_UP = {
  hidden: { opacity: 0, y: 52, filter: 'blur(12px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};
const REVEAL_LEFT = {
  hidden: { opacity: 0, x: -60, filter: 'blur(10px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

function Reveal({ children, variant = REVEAL_UP, delay = 0, className = '' }: {
  children: React.ReactNode; variant?: typeof REVEAL_UP; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });
  return (
    <motion.div ref={ref} className={className} variants={variant} initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      transition={{ ...variant.show.transition, delay: delay / 1000 } as never}>
      {children}
    </motion.div>
  );
}

/* ─── projects data ───────────────────────── */
const projects = [
  {
    num: '01', title: 'Meridian', category: 'SaaS Platform', tags: ['Web App', 'AI', 'Analytics'],
    desc: 'End-to-end business intelligence platform with real-time dashboards and predictive analytics for enterprise clients.',
    year: '2025',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    num: '02', title: 'Strata', category: 'E-Commerce System', tags: ['Commerce', 'Automation', 'Scale'],
    desc: 'Custom headless commerce architecture serving 2M+ monthly transactions with sub-100ms response times.',
    year: '2025',
    image: 'https://images.pexels.com/photos/5632381/pexels-photo-5632381.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    num: '03', title: 'Vanta AI', category: 'AI Product', tags: ['LLM', 'Automation', 'API'],
    desc: 'Proprietary AI workflow engine that automated 80% of manual operations for a Fortune 500 logistics company.',
    year: '2024',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    num: '04', title: 'Nocturne', category: 'Creative Platform', tags: ['Media', 'Web', 'CMS'],
    desc: 'Next-generation content platform for independent publishers — built for speed, built for scale.',
    year: '2024',
    image: 'https://images.pexels.com/photos/3585088/pexels-photo-3585088.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    num: '05', title: 'Axiom', category: 'Data Infrastructure', tags: ['Backend', 'Scale', 'Cloud'],
    desc: 'Cloud-native data pipeline processing 500M+ events per day for a global fintech firm.',
    year: '2024',
    image: 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
  {
    num: '06', title: 'Pulse', category: 'Mobile Product', tags: ['iOS', 'React Native', 'UX'],
    desc: 'Consumer wellness application with 200K+ downloads in its first month on the App Store.',
    year: '2023',
    image: 'https://images.pexels.com/photos/6476805/pexels-photo-6476805.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  },
];

/* ─── single card in stacked scroll ─────── */
function CascadeCard({ project: p, index, total, scrollYProgress }: {
  project: typeof projects[number]; index: number; total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const sliceStart = index / total;
  const sliceEnd = (index + 1) / total;
  const peelPoint = sliceStart + (sliceEnd - sliceStart) * 0.4;
  const isEven = index % 2 === 0;
  const peelX = isEven ? -300 : 300;
  const peelRotate = isEven ? -8 : 8;

  const y = useTransform(scrollYProgress, [0, sliceStart, peelPoint, sliceEnd, 1], [12 * (total - index), 0, 0, -200, -200]);
  const x = useTransform(scrollYProgress, [0, sliceStart, peelPoint, sliceEnd, 1], [0, 0, 0, peelX, peelX]);
  const rotate = useTransform(scrollYProgress, [0, sliceStart, peelPoint, sliceEnd, 1], [0, 0, 0, peelRotate, peelRotate]);
  const scale = useTransform(scrollYProgress, [0, sliceStart, peelPoint, sliceEnd, 1], [0.96, 1, 1, 0.88, 0.88]);
  const opacity = useTransform(scrollYProgress, [0, sliceStart, peelPoint, sliceEnd, 1], [1, 1, 1, 0, 0]);

  const cfg = { stiffness: 120, damping: 30 };
  const springY = useSpring(y, cfg);
  const springX = useSpring(x, cfg);
  const springRotate = useSpring(rotate, cfg);
  const springScale = useSpring(scale, cfg);
  const springOpacity = useSpring(opacity, { stiffness: 200, damping: 30 });

  return (
    <motion.div className="absolute inset-0 flex items-center justify-center"
      style={{ y: springY, x: springX, rotate: springRotate, scale: springScale, opacity: springOpacity, zIndex: total - index, willChange: 'transform, opacity', transformOrigin: 'center 90%' }}>
      <div className="w-full max-w-4xl group cursor-default">
        <article className="relative overflow-hidden rounded-3xl border border-gray-200 bg-[#f4f4f4] shadow-[0_4px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_60px_rgba(0,0,0,0.1)] transition-shadow duration-500">
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <img src={p.image} alt={p.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-[1.01] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f4f4f4]" />
            <div className="absolute top-6 right-8 font-black text-gray-200/80 select-none leading-none" style={{ fontSize: 'clamp(72px, 10vw, 140px)' }}>{p.num}</div>
            <div className="absolute top-5 left-5">
              <span className="text-[9px] tracking-[0.28em] uppercase text-gray-700 bg-[#f4f4f4]/80 backdrop-blur-md border border-gray-200 rounded-full px-3.5 py-1.5">{p.category}</span>
            </div>
            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-400 translate-y-1 group-hover:translate-y-0">
              <div className="w-9 h-9 bg-black rounded-full flex items-center justify-center shadow-lg">
                <ExternalLink size={13} className="text-white" />
              </div>
            </div>
          </div>
          <div className="px-8 py-6 flex items-end justify-between">
            <div>
              <h3 className="text-3xl md:text-4xl font-classic tracking-tight text-black">{p.title}</h3>
              <p className="text-sm text-gray-500 mt-1.5 max-w-md leading-relaxed">{p.desc}</p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0 ml-6">
              <span className="text-[10px] text-gray-400 font-mono">{p.year}</span>
              <div className="flex flex-wrap gap-1.5 justify-end">
                {p.tags.map((tag) => (
                  <span key={tag} className="text-[8px] tracking-[0.2em] uppercase text-gray-500 border border-gray-200 rounded-full px-2 py-0.5">{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 bg-black" />
        </article>
      </div>
    </motion.div>
  );
}

function CascadingCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const total = projects.length;

  return (
    <div ref={containerRef} style={{ height: `${(total + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-5xl mx-auto px-8 md:px-16 h-full flex items-center justify-center">
          {projects.map((p, i) => (
            <CascadeCard key={p.num} project={p} index={i} total={total} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── work page ───────────────────────────── */
export default function WorkPage() {
  return (
    <div className="pt-0">
      {/* Hero */}
      <section className="relative pt-40 pb-16 px-8 md:px-16 bg-[#f4f4f4] border-b border-gray-200">
        <Reveal variant={REVEAL_LEFT}>
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-sans">Selected Work</p>
          <h1 className="text-6xl md:text-9xl font-classic uppercase leading-none tracking-tight text-black">
            Our<br /><span className="text-gray-400">Work</span>
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-8 text-xl md:text-2xl font-classic italic text-gray-600 max-w-xl">
            A curated collection of products built to last.
          </p>
        </Reveal>
      </section>

      {/* Cascading card stack */}
      <section className="relative bg-[#f4f4f4]">
        <CascadingCards />
      </section>

      {/* Grid of additional work */}
      <section className="py-32 px-8 md:px-16 bg-[#f4f4f4] border-t border-gray-200">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-classic uppercase text-black mb-16">More Projects</h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: 'Orbit Design System', category: 'Design', year: '2023', tags: ['Figma', 'React', 'Tokens'] },
            { title: 'Kinetic CMS', category: 'Platform', year: '2023', tags: ['Node.js', 'GraphQL', 'S3'] },
            { title: 'Fenix Auth', category: 'Infrastructure', year: '2022', tags: ['Security', 'OAuth', 'MFA'] },
            { title: 'Mosaic Analytics', category: 'Data', year: '2022', tags: ['Python', 'BI', 'ML'] },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="group border border-gray-200 rounded-2xl p-8 bg-[#f4f4f4] hover:border-black transition-colors duration-300 cursor-default">
                <div className="flex items-start justify-between mb-6">
                  <span className="text-xs uppercase tracking-widest text-gray-500 font-sans">{item.category}</span>
                  <span className="text-xs text-gray-400 font-mono">{item.year}</span>
                </div>
                <h3 className="text-3xl font-classic uppercase text-black mb-4">{item.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((t) => (
                    <span key={t} className="text-[9px] tracking-widest uppercase border border-gray-300 text-gray-500 rounded-full px-3 py-1">{t}</span>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors">
                  <ArrowUpRight size={14} />
                  <span>View case</span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
