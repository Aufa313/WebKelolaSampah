import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { landingFaq } from "../../data/faq";

export default function LandingFaq() {
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {landingFaq.map((faq, index) => {
        const isOpen = activeFaqIndex === index;
        return (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300"
            id={`faq-item-${index}`}
          >
            <button
              type="button"
              onClick={() => setActiveFaqIndex(isOpen ? null : index)}
              className="w-full py-5 px-6 flex items-center justify-between text-left hover:bg-slate-50/50 transition duration-200 outline-none select-none"
            >
              <span className="font-sans font-bold text-xs md:text-sm text-slate-700 pr-4">
                {faq.question}
              </span>
              <span className="shrink-0 text-slate-400 p-1 bg-slate-50 border border-slate-100 rounded-lg">
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#008444]" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 pt-1 border-t border-slate-100 text-slate-500 font-sans leading-relaxed text-xs md:text-sm bg-slate-50/20">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
