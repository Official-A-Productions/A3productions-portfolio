import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Work', href: '/work' },
  { label: 'Studio', href: '/studio' },
  { label: 'Contact', href: '/contact' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { scrollY } = useScroll();

  // Nav visibility: hidden on desktop home until past the hero, always visible elsewhere
  const [showNav, setShowNav] = useState(!isHome);

  useEffect(() => {
    // On non-home pages always show nav
    if (!isHome) {
      setShowNav(true);
      return;
    }
    // On home mobile always show nav
    const handleResize = () => {
      if (window.innerWidth < 768) setShowNav(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isHome]);

  // On home desktop, show nav only after scrolling past the 350vh hero
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (!isHome) return;
    if (window.innerWidth >= 768) {
      setShowNav(latest > window.innerHeight * 3);
    }
  });

  // Always compute these transforms (no conditional hooks)
  const navBg = useTransform(
    scrollY,
    [0, 80],
    ['rgba(244,244,244,0)', 'rgba(244,244,244,0.92)']
  );
  const navBorderColor = useTransform(
    scrollY,
    [0, 80],
    ['rgba(0,0,0,0)', 'rgba(0,0,0,0.08)']
  );
  const navBorderBottom = useTransform(
    navBorderColor,
    (c) => `1px solid ${c}`
  );

  // Reset scroll on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Track if we're inside the mobile hero (black background) section
  // Mobile hero is 220vh tall — invert logo while in that zone
  const [logoInverted, setLogoInverted] = useState(isHome);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (!isHome || window.innerWidth >= 768) return;
    // Hero sticky zone ends around 120vh (leaves enough room for the fade-out)
    const threshold = window.innerHeight * 1.2;
    setLogoInverted(latest < threshold);
  });

  // Also initialise correctly on page load
  useEffect(() => {
    if (!isHome) { setLogoInverted(false); return; }
    if (window.innerWidth < 768) setLogoInverted(window.scrollY < window.innerHeight * 1.2);
  }, [isHome]);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative bg-[#f4f4f4] text-black overflow-x-clip">
      {/* Grain */}
      <div className="grain-overlay-light" />



      {/* Full-screen mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed inset-0 z-[60] bg-black flex flex-col px-8 pt-24 pb-16"
          >
            {/* Close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-5 right-8 w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
              aria-label="Close menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {/* Nav links */}
            <nav className="flex flex-col gap-2 mt-4">
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-[14vw] font-black uppercase leading-none tracking-tighter text-white hover:text-gray-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="mt-auto"
            >
              <div className="w-full h-px bg-white/10 mb-8" />
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/30 font-sans mb-3">Get in touch</p>
              <a href="mailto:officialA3Productions@gmail.com" className="text-white/70 hover:text-white text-sm font-sans transition-colors">
                officialA3Productions@gmail.com
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAV */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-14 py-5"
        initial={{ opacity: isHome ? 0 : 1, y: isHome ? -16 : 0 }}
        animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : -16 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          backgroundColor: 'transparent',
          borderBottom: isHome ? navBorderBottom : '1px solid rgba(0,0,0,0.07)',
          pointerEvents: showNav ? 'auto' : 'none',
        } as never}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/Logo.webp"
            alt="Productions"
            className={`h-9 w-auto object-contain opacity-80 group-hover:opacity-100 transition-all duration-500 ${logoInverted ? 'filter invert' : ''
              }`}
          />
          <span className="hidden sm:flex items-center gap-3">
            <span className="text-gray-300 font-light pb-0.5">|</span>
            <span className="text-[12px] tracking-[0.3em] uppercase text-gray-500 group-hover:text-black transition-colors duration-300">
              Productions
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-9">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`relative text-[10px] tracking-[0.35em] uppercase font-medium transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-px after:bg-black after:transition-all after:duration-300 ${location.pathname === item.href
                  ? 'text-black after:w-full'
                  : 'text-gray-500 hover:text-black after:w-0 hover:after:w-full'
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <span className="block w-6 h-0.5 bg-black" />
          <span className="block w-4 h-0.5 bg-black" />
        </button>
      </motion.nav>

      {children}

      {/* FOOTER */}
      <footer className="relative bg-black pt-32 pb-16 px-8 md:px-16 text-white overflow-hidden font-classic">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32">
          <div className="lg:col-span-2">
            <h3 className="text-4xl md:text-6xl font-classic uppercase mb-6 text-white leading-tight">
              Let's build<br />
              something<br />
              <span className="text-gray-500">iconic.</span>
            </h3>
            <div className="flex flex-col items-start gap-4">
              <a
                href="mailto:officialA3Productions@gmail.com"
                className="text-xl text-gray-400 hover:text-white transition-colors duration-300 border-b border-gray-700 hover:border-white pb-1 inline-block"
              >
                officialA3Productions@gmail.com
              </a>
              <a
                href="tel:+918447752642"
                className="text-xl text-gray-400 hover:text-white transition-colors duration-300 border-b border-gray-700 hover:border-white pb-1 inline-block"
              >
                +91 8447752642
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-sans text-gray-500 mb-6 uppercase tracking-widest">Navigate</h4>
            <ul className="space-y-4">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-gray-400 hover:text-white transition-colors duration-300 text-lg font-classic">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-sans text-gray-500 mb-6 uppercase tracking-widest">Socials</h4>
            <ul className="space-y-4">
              {['Twitter', 'Instagram', 'LinkedIn', 'Dribbble'].map((social) => (
                <li key={social}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 text-lg font-classic">
                    {social}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-800 gap-4 text-sm font-sans text-gray-500">
          <p>© {new Date().getFullYear()} A³ Productions. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Operating from</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-300">Greater Noida, Uttar Pradesh, India</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
