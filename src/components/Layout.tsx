import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import StaggeredMenu from './StaggeredMenu';

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

  return (
    <div className="relative bg-[#f4f4f4] text-black overflow-x-clip">
      {/* Grain */}
      <div className="grain-overlay-light" />

      {/* NAV */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-14 py-6"
        initial={{ opacity: isHome ? 0 : 1, y: isHome ? -20 : 0 }}
        animate={{ opacity: showNav ? 1 : 0, y: showNav ? 0 : -20 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{
          backgroundColor: isHome ? navBg : 'rgba(244,244,244,0.92)',
          borderBottom: isHome ? navBorderBottom : '1px solid rgba(0,0,0,0.08)',
          backdropFilter: 'blur(12px)',
          pointerEvents: showNav ? 'auto' : 'none',
        } as never}
      >
        <Link to="/" className="flex items-center gap-3">
          <img src="/image.png" alt="A3 Productions" className="h-8 w-auto object-contain filter invert" />
          <div className="w-px h-4 bg-gray-300" />
          <span className="text-gray-700 text-[10px] tracking-[0.3em] uppercase font-medium">Productions</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`nav-link-light text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 ${
                location.pathname === item.href ? 'text-black' : 'text-gray-600 hover:text-black'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="md:hidden">
          <StaggeredMenu
            isFixed={true}
            logoUrl={null}
            items={NAV_ITEMS.map((n) => ({ label: n.label, link: n.href }))}
            socialItems={[
              { label: 'Twitter', link: '#' },
              { label: 'LinkedIn', link: '#' },
              { label: 'Dribbble', link: '#' },
            ]}
            colors={['#f4f4f4', '#e5e5e5']}
          />
        </div>
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
            <a
              href="mailto:hello@a3productions.com"
              className="text-xl text-gray-400 hover:text-white transition-colors duration-300 border-b border-gray-700 hover:border-white pb-1 inline-block"
            >
              hello@a3productions.com
            </a>
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
            <span className="text-gray-300">San Francisco, CA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
