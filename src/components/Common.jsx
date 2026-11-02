import { useState } from 'react';
import { ChevronDown, ImageOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Img = ({ src, alt, className = '' }) => {
  const [bad, setBad] = useState(false);
  return bad ? (
    <div role="img" aria-label={alt} className={`flex items-center justify-center bg-[#F7F8FA] text-[#A7ADB4] ${className}`}>
      <ImageOff size={28} />
    </div>
  ) : (
    <img src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className={`object-cover ${className}`} />
  );
};

export const Reveal = ({ children, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.4, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export const FAQ = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map(([q, a], i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={q}
            className={`rounded-2xl border transition-all duration-200 ${
              isOpen
                ? 'border-[#E5B544] bg-white shadow-sm ring-1 ring-[#E5B544]/20'
                : 'border-[#E5E7EB] bg-white hover:border-[#A7ADB4]'
            }`}
          >
            <button
              className="flex w-full items-center justify-between p-3.5 sm:p-5 text-left font-bold text-[#171717] focus:outline-none cursor-pointer"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
            >
              <span className="text-xs sm:text-base pr-2.5 sm:pr-4 leading-snug">{q}</span>
              <span
                className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                  isOpen ? 'bg-[#E5B544] text-[#171717] rotate-180' : 'bg-[#F7F8FA] text-[#53627A]'
                }`}
              >
                <ChevronDown size={17} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <p className="px-3.5 pb-4 pt-2 text-xs sm:text-sm text-[#53627A] leading-relaxed border-t border-[#E5E7EB] sm:px-5 sm:pb-5">
                    {a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export const Logo = ({ className = 'h-11' }) => (
  <img
    src={new URL('../assets/logo.png', import.meta.url).href}
    alt="The Best Insurance Company"
    className={`${className} w-auto object-contain`}
  />
);
