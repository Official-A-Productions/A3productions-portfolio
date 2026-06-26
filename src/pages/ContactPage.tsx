import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Mail, MapPin, Clock, Phone } from 'lucide-react';
import { Globe3D, GlobeMarker } from '../components/ui/3d-globe';

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

const services = [
  { title: 'Web Products', desc: 'Full-stack web applications engineered for scale, speed, and long-term maintainability.' },
  { title: 'AI Systems', desc: 'Custom LLM integrations, automation pipelines, and intelligent data workflows.' },
  { title: 'Design Systems', desc: 'Component libraries and design systems that unify product experience at every touchpoint.' },
  { title: 'Growth Engineering', desc: 'Performance, analytics, and conversion infrastructure that compounds over time.' },
];

const faqs = [
  { q: 'What is your typical project timeline?', a: 'Most projects run 8–16 weeks from kickoff to launch, depending on scope. We\'ll give you an accurate estimate after our initial discovery call.' },
  { q: 'Do you work with early-stage startups?', a: 'Absolutely. We love working with founders from the ground up — especially on products that need strong technical architecture from day one.' },
  { q: 'What is your minimum engagement?', a: 'We take on projects starting at $15K. For ongoing retainer work, we offer monthly partnerships for product teams that need embedded engineering.' },
  { q: 'Can you take over an existing codebase?', a: 'Yes. We\'ve successfully rescued and scaled multiple legacy codebases. We\'ll do a thorough audit before committing to a roadmap.' },
];

const noidaMarker: GlobeMarker[] = [
  {
    lat: 28.5355,
    lng: 77.3910,
    src: "https://assets.aceternity.com/avatars/1.webp",
    label: "Noida, UP",
  }
];

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: '', email: '', project: '', budget: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/officialA3Productions@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          project: formState.project,
          budget: formState.budget,
          message: formState.message,
          _subject: `New Inquiry from ${formState.name} on A3 Productions`
        })
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("There was an error sending your message. Please try again or email us directly.");
      }
    } catch (error) {
      alert("There was an error sending your message. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full bg-transparent border-b border-gray-300 focus:border-black outline-none py-3 text-black font-classic text-lg placeholder-gray-400 transition-colors duration-300 disabled:opacity-50";

  return (
    <div className="pt-0 bg-[#f4f4f4]">
      {/* Hero */}
      <section className="relative pt-40 pb-24 px-8 md:px-16 border-b border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <Reveal variant={REVEAL_LEFT}>
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-4 font-sans">Get In Touch</p>
              <h1 className="text-6xl md:text-9xl font-classic uppercase leading-none tracking-tight text-black">
                Let's<br /><span className="text-gray-400">Talk</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-8 text-xl md:text-2xl font-classic italic text-gray-600 max-w-xl leading-relaxed">
                Tell us about your project. We respond to every inquiry within 24 hours.
              </p>
            </Reveal>
          </div>

          <div className="relative w-full aspect-square max-h-[500px] flex items-center justify-center mt-8 lg:mt-0 px-4 md:px-0">
            <Reveal delay={400} className="w-full h-full relative flex items-center justify-center">
              <div className="w-full h-full max-w-[400px] lg:max-w-none mx-auto flex items-center justify-center">
                <Globe3D
                  markers={noidaMarker}
                  className="w-full h-full"
                  config={{
                    bumpScale: 5,
                    autoRotateSpeed: 0.3,
                    showAtmosphere: false,
                  }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact info + form */}
      <section className="py-32 px-8 md:px-16 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          {/* Left: info */}
          <div>
            <Reveal>
              <h2 className="text-3xl md:text-4xl font-classic uppercase text-black mb-12">Contact Details</h2>
            </Reveal>
            <div className="space-y-8">
              <Reveal delay={100}>
                <div className="flex items-start gap-4">
                  <Mail size={18} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mb-1">Email</p>
                    <a href="mailto:officialA3Productions@gmail.com" className="text-xl font-classic text-black hover:text-gray-600 transition-colors">officialA3Productions@gmail.com</a>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={125}>
                <div className="flex items-start gap-4">
                  <Phone size={18} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mb-1">Phone</p>
                    <a href="tel:+918447752642" className="text-xl font-classic text-black hover:text-gray-600 transition-colors">+91 8447752642</a>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={150}>
                <div className="flex items-start gap-4">
                  <MapPin size={18} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mb-1">Location</p>
                    <p className="text-xl font-classic text-black">Greater Noida, Uttar Pradesh, India</p>
                    <p className="text-sm font-classic italic text-gray-500">Available globally for remote engagements</p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={200}>
                <div className="flex items-start gap-4">
                  <Clock size={18} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mb-1">Response Time</p>
                    <p className="text-xl font-classic text-black">Within 24 hours</p>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={250}>
              <div className="mt-16">
                <p className="text-xs uppercase tracking-widest text-gray-500 font-sans mb-6">What We Build</p>
                <div className="space-y-4">
                  {services.map((s, i) => (
                    <div key={s.title} className="border-b border-gray-200 pb-4">
                      <h4 className="text-lg font-classic uppercase text-black">{s.title}</h4>
                      <p className="text-sm font-classic italic text-gray-500 mt-1">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right: form */}
          <Reveal delay={100}>
            {submitted ? (
              <div className="flex flex-col items-start justify-center h-full py-20">
                <p className="text-6xl mb-4">✓</p>
                <h3 className="text-4xl font-classic uppercase text-black mb-4">Message Received</h3>
                <p className="font-classic italic text-gray-600 text-xl">We'll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 font-sans mb-2">Your Name</label>
                  <input type="text" required placeholder="Jane Smith" value={formState.name}
                    disabled={isSubmitting}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 font-sans mb-2">Email Address</label>
                  <input type="email" required placeholder="jane@company.com" value={formState.email}
                    disabled={isSubmitting}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 font-sans mb-2">Project Type</label>
                  <input type="text" placeholder="e.g. SaaS platform, AI tool..." value={formState.project}
                    disabled={isSubmitting}
                    onChange={(e) => setFormState({ ...formState, project: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 font-sans mb-2">Estimated Budget</label>
                  <input type="text" placeholder="e.g. ₹1L – ₹5L, $10K, Let's discuss..." value={formState.budget}
                    disabled={isSubmitting}
                    onChange={(e) => setFormState({ ...formState, budget: e.target.value })}
                    className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-500 font-sans mb-2">Tell Us More</label>
                  <textarea required rows={4} placeholder="Describe your project, timeline, and goals..."
                    value={formState.message}
                    disabled={isSubmitting}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className={`${inputClass} resize-none`} />
                </div>
                <button type="submit" disabled={isSubmitting}
                  className="group inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-semibold text-sm tracking-wide uppercase hover:bg-gray-800 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-32 px-8 md:px-16">
        <Reveal>
          <h2 className="text-4xl md:text-5xl font-classic uppercase text-black mb-16">
            Frequently <span className="text-gray-400">Asked</span>
          </h2>
        </Reveal>
        <div className="max-w-3xl space-y-px">
          {faqs.map((faq, i) => (
            <FaqItem key={i} q={faq.q} a={faq.a} delay={i * 80} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FaqItem({ q, a, delay }: { q: string; a: string; delay: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={delay}>
      <div className="border-b border-gray-200 py-6">
        <button onClick={() => setOpen(!open)}
          className="w-full flex items-start justify-between gap-4 text-left group">
          <span className="text-xl font-classic text-black">{q}</span>
          <span className={`text-2xl text-gray-400 transition-transform duration-300 shrink-0 ${open ? 'rotate-45' : ''}`}>+</span>
        </button>
        <motion.div initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden">
          <p className="pt-4 font-classic italic text-gray-600 text-lg leading-relaxed">{a}</p>
        </motion.div>
      </div>
    </Reveal>
  );
}
