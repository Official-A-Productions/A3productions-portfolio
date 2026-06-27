import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import PrismaticBurst from './PrismaticBurst';

export default function MobileHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  // "we" — flies top-left + blurs out
  const weX = useTransform(smoothProgress, [0, 1], [0, -160]);
  const weY = useTransform(smoothProgress, [0, 1], [0, -180]);
  const weRotate = useTransform(smoothProgress, [0, 1], [0, -18]);
  const weScale = useTransform(smoothProgress, [0, 1], [1, 1.8]);
  const weOpacity = useTransform(smoothProgress, [0, 0.5, 0.75], [1, 0.3, 0]);
  const weBlur = useTransform(smoothProgress, [0, 0.6], [0, 20]);
  const weFilter = useTransform(weBlur, (v) => `blur(${v}px)`);

  // "scale" — flies right + blurs out
  const scaleX = useTransform(smoothProgress, [0, 1], [0, 180]);
  const scaleY = useTransform(smoothProgress, [0, 1], [0, -60]);
  const scaleRotate = useTransform(smoothProgress, [0, 1], [0, 12]);
  const scaleScale = useTransform(smoothProgress, [0, 1], [1, 2.2]);
  const scaleOpacity = useTransform(smoothProgress, [0, 0.4, 0.65], [1, 0.3, 0]);
  const scaleBlur = useTransform(smoothProgress, [0, 0.5], [0, 20]);
  const scaleFilter = useTransform(scaleBlur, (v) => `blur(${v}px)`);

  // "systems." — flies bottom-left + blurs out
  const systemsX = useTransform(smoothProgress, [0, 1], [0, -80]);
  const systemsY = useTransform(smoothProgress, [0, 1], [0, 220]);
  const systemsRotate = useTransform(smoothProgress, [0, 1], [0, -8]);
  const systemsScale = useTransform(smoothProgress, [0, 1], [1, 1.6]);
  const systemsOpacity = useTransform(smoothProgress, [0, 0.6, 0.85], [1, 0.3, 0]);
  const systemsBlur = useTransform(smoothProgress, [0, 0.7], [0, 20]);
  const systemsFilter = useTransform(systemsBlur, (v) => `blur(${v}px)`);

  // Subtitle
  const subtitleOpacity = useTransform(smoothProgress, [0, 0.25, 0.5], [1, 0.4, 0]);
  const subtitleBlur = useTransform(smoothProgress, [0, 0.4], [0, 12]);
  const subtitleFilter = useTransform(subtitleBlur, (v) => `blur(${v}px)`);

  // Container fades out last
  const containerOpacity = useTransform(smoothProgress, [0.6, 1], [1, 0]);

  return (
    <div ref={containerRef} className="md:hidden h-[220vh] w-full relative">
      <motion.div
        className="sticky top-0 left-0 w-full h-screen overflow-hidden bg-black"
        style={{ opacity: containerOpacity }}
      >
        {/* PrismaticBurst WebGL background */}
        <div className="absolute inset-0 z-0">
          <PrismaticBurst
            animationType="rotate3d"
            intensity={2}
            speed={0.4}
            distort={0.8}
            paused={false}
            offset={{ x: 0, y: 0 }}
            hoverDampness={0}
            rayCount={0}
            mixBlendMode="lighten"
            colors={['#ff007a', '#4d3dff', '#00cfff', '#a855f7']}
          />
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Text content */}
        <div className="relative z-20 flex flex-col items-start justify-center h-full px-8 pt-20">
          <motion.h1
            className="text-[21vw] font-black lowercase leading-[0.82] tracking-[-0.04em] text-white will-change-transform"
            style={{ x: weX, y: weY, rotate: weRotate, scale: weScale, opacity: weOpacity, filter: weFilter }}
          >
            we
          </motion.h1>
          <motion.h1
            className="text-[21vw] font-black lowercase leading-[0.82] tracking-[-0.04em] text-white will-change-transform"
            style={{ x: scaleX, y: scaleY, rotate: scaleRotate, scale: scaleScale, opacity: scaleOpacity, filter: scaleFilter }}
          >
            scale
          </motion.h1>
          <motion.h1
            className="text-[21vw] font-black lowercase leading-[0.82] tracking-[-0.04em] text-white will-change-transform"
            style={{ x: systemsX, y: systemsY, rotate: systemsRotate, scale: systemsScale, opacity: systemsOpacity, filter: systemsFilter }}
          >
            systems.
          </motion.h1>

          {/* Subtitle */}
          <motion.div
            className="mt-10 max-w-[88%]"
            style={{ opacity: subtitleOpacity, filter: subtitleFilter }}
          >
            <p className="text-[15px] font-sans font-medium text-white leading-relaxed tracking-wide">
              Premier systems architecture & product engineering studio.
              Building scalable software for companies who{' '}
              <span className="italic text-white/60">refuse to settle.</span>
            </p>
            <div className="mt-5 flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
              <span className="text-[10px] uppercase tracking-[0.35em] text-white/35 font-sans">
                Available for new projects
              </span>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-8 flex flex-col items-start gap-2"
          style={{ opacity: subtitleOpacity }}
        >
          <span className="text-[9px] uppercase tracking-[0.45em] text-white/40 font-sans">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </motion.div>
    </div>
  );
}
