import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function MobileHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Whole section slides up and fades as user scrolls past — subtle parallax exit only
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-12%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1, 0]);

  return (
    <div ref={containerRef} className="md:hidden relative w-full" style={{ height: '100vh' }}>
      <motion.div
        className="sticky top-0 left-0 w-full h-screen overflow-hidden"
        style={{ opacity }}
      >
        {/* Background image */}
        <motion.div className="absolute inset-0 z-0" style={{ y }}>
          <img
            src="/background.png"
            alt=""
            className="w-full h-full object-cover"
            draggable={false}
          />
        </motion.div>

        {/* Vignette overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.5) 100%)',
          }}
        />

        {/* Gradient transition at bottom — blends into page bg */}
        <div
          className="absolute bottom-0 left-0 w-full z-20 pointer-events-none"
          style={{
            height: '45%',
            background:
              'linear-gradient(to bottom, transparent 0%, rgba(20,10,30,0.3) 30%, rgba(30,15,40,0.7) 55%, rgba(244,244,244,0.92) 85%, #f4f4f4 100%)',
          }}
        />

        {/* Text — fully static, no scroll animations */}
        <div className="relative z-30 flex flex-col items-start justify-center h-full px-8 pt-20 pb-32">
          <h1 className="text-[21vw] font-black lowercase leading-[0.82] tracking-[-0.04em] text-white">
            we
          </h1>
          <h1 className="text-[21vw] font-black lowercase leading-[0.82] tracking-[-0.04em] text-white">
            scale
          </h1>
          <h1 className="text-[21vw] font-black lowercase leading-[0.82] tracking-[-0.04em] text-white">
            systems.
          </h1>

          {/* Subtitle */}
          <div className="mt-10 max-w-[88%]">
            <p className="text-[15px] font-sans font-medium text-white/90 leading-relaxed tracking-wide">
              Premier systems architecture &amp; product engineering studio.
              Building scalable software for companies who{' '}
              <span className="italic text-white/60">refuse to settle.</span>
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-white/40 font-sans">
                Available for new projects
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-8 z-30 flex flex-col items-start gap-2">
          <span className="text-[9px] uppercase tracking-[0.45em] text-white/40 font-sans">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
