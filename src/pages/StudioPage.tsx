import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Cubes from '../components/Cubes';

/* ─── reveal ──────────────────────────────── */
const REVEAL_UP = {
  hidden: { opacity: 0, y: 52, filter: 'blur(12px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
};
const REVEAL_LEFT = {
  hidden: { opacity: 0, x: -60, filter: 'blur(10px)' },
  show: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};
const REVEAL_RIGHT = {
  hidden: { opacity: 0, x: 60, filter: 'blur(10px)' },
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

const stats = [
  { value: '5+', label: 'Products Shipped' },
  { value: '10k+', label: 'Users Reached' },
];

const team = [
  { name: 'Aryan', role: 'Founder & CEO', specialty: 'Systems Architecture' },
  { name: 'Ashish Singh', role: 'Head of Design', specialty: 'Visual Systems' },
  { name: 'Ankit Singh', role: 'Lead Engineer', specialty: 'Full-Stack & AI' },
];

const values = [
  { num: '01', title: 'Craft Over Speed', desc: 'We take the time to build things right. Every detail is deliberate, every line of code intentional.' },
  { num: '02', title: 'Systems Thinking', desc: 'We design for scale from day one. Architecture that compounds in value over time.' },
  { num: '03', title: 'Radical Transparency', desc: 'Clear communication at every stage. No hidden costs, no surprise pivots.' },
  { num: '04', title: 'Ownership Mentality', desc: 'We treat every product as if it were our own, because reputationally, it is.' },
];

export default function StudioPage() {
  return (
    <div className="pt-0 bg-[#f4f4f4]">
      {/* Hero */}
      <section className="relative pt-40 pb-24 px-8 md:px-16 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal variant={REVEAL_LEFT}>
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-sans">About Us</p>
              <h1 className="text-6xl md:text-9xl font-classic uppercase leading-none tracking-tight text-black">
                The<br /><span className="text-gray-400">Studio</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-8 text-xl md:text-2xl font-classic italic text-gray-600 max-w-xl leading-relaxed">
                We are A³ Productions — a small, expert team that builds products designed to compound in value over time.
              </p>
            </Reveal>
          </div>
          <Reveal variant={REVEAL_RIGHT} delay={100}>
            <div style={{ width: '100%', height: '420px' }}>
              <Cubes gridSize={8} faceColor="#f4f4f4" borderStyle="1px solid #000" rippleColor="#000" autoAnimate={true} rippleOnClick={true} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 px-8 md:px-16 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="text-center">
                <p className="text-5xl md:text-7xl font-classic text-black mb-2">{s.value}</p>
                <p className="text-xs uppercase tracking-widest text-gray-500 font-sans">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-32 px-8 md:px-16 border-b border-gray-200">
        <div className="max-w-4xl">
          <Reveal variant={REVEAL_LEFT}>
            <p className="text-sm uppercase tracking-widest text-gray-500 mb-8 font-sans">Our Mission</p>
          </Reveal>
          <Reveal delay={100}>
            <blockquote className="text-3xl md:text-5xl font-classic italic text-black leading-snug">
              "We believe the best products are the ones that age like architecture — beautiful, functional, and built to outlast trends."
            </blockquote>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 px-8 md:px-16 border-b border-gray-200">
        <Reveal>
          <h2 className="text-4xl md:text-6xl font-classic uppercase text-black mb-20">
            What We <span className="text-gray-400">Stand For</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px border border-gray-200 rounded-2xl overflow-hidden">
          {values.map((v, i) => (
            <Reveal key={v.num} delay={i * 100}>
              <div className="p-10 bg-[#f4f4f4] hover:bg-white transition-colors duration-300 group border-b md:border-b-0 border-gray-200 last:border-0">
                <span className="text-xs text-gray-400 font-mono mb-4 block">{v.num}</span>
                <h3 className="text-2xl font-classic uppercase text-black mb-3">{v.title}</h3>
                <p className="text-gray-600 font-classic italic leading-relaxed">{v.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-32 px-8 md:px-16">
        <Reveal>
          <h2 className="text-4xl md:text-6xl font-classic uppercase text-black mb-20">
            The <span className="text-gray-400">People</span>
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <Reveal key={member.name} delay={i * 100}>
              <div className="group">
                <div className="aspect-square bg-gray-200 rounded-2xl mb-5 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center text-5xl font-classic text-gray-400 uppercase">
                    {member.name.charAt(0)}
                  </div>
                </div>
                <h3 className="text-xl font-classic text-black">{member.name}</h3>
                <p className="text-sm uppercase tracking-widest text-gray-500 font-sans mt-1">{member.role}</p>
                <p className="text-sm font-classic italic text-gray-400 mt-1">{member.specialty}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
