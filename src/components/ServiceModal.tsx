import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ServiceDetail {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  cta: string;
  images: string[];
}

interface ServiceModalProps {
  service: ServiceDetail | null;
  onClose: () => void;
}

export default function ServiceModal({ service, onClose }: ServiceModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (service) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [service]);

  return (
    <AnimatePresence>
      {service && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 pointer-events-none">
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#f4f4f4] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-full relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-black/5 hover:bg-black/10 rounded-full transition-colors z-20"
                aria-label="Close modal"
              >
                <X size={20} className="text-black" />
              </button>

              <div className="overflow-y-auto">
                <div className="p-8 md:p-12 lg:p-16">
                  {/* Header Area */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch mb-8">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-classic uppercase text-black leading-tight mb-4">
                        {service.title}
                      </h2>
                      <p className="text-black font-sans font-medium text-base md:text-lg leading-relaxed mb-8">
                        {service.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-10">
                        {service.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-gray-300 text-gray-800 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* CTA */}
                      <Link
                        to="/contact"
                        onClick={onClose}
                        className="group inline-flex items-center gap-2 text-black border-b border-black pb-1 text-[11px] uppercase tracking-widest hover:opacity-60 transition-opacity duration-300"
                      >
                        <span>{service.cta}</span>
                        <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </Link>
                    </div>

                    {/* Right side Images: Single Image */}
                    <div className="flex flex-col gap-4 mt-8 lg:mt-0">
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200 shadow-md group">
                        <img 
                          src={service.images[0]} 
                          alt={`${service.title} hero`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
