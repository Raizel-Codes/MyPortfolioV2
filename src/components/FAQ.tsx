"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqContent } from "@/data/site";
import { Reveal } from "@/components/Reveal";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section" id="faq" aria-labelledby="faq-title">
      <Reveal as="div" className="container faq-grid reveal-fade">
        <div>
          <h2 className="slash-title" id="faq-title">/FAQ</h2>
          <p className="section-title">{faqContent.title}</p>
          <p className="section-lede">{faqContent.lede}</p>
        </div>

        <ul className="faq-list">
          {faqContent.items.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <li className="faq-item reveal-item" style={{ "--i": index } as React.CSSProperties} key={faq.question}>
                <span className="faq-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  {faq.question}
                  <Plus className="faq-icon" size={20} aria-hidden="true" />
                </button>
                <div className="faq-answer" id={`faq-answer-${index}`} data-open={isOpen}>
                  <div>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
