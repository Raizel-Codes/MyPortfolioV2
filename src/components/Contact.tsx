"use client";

import { useEffect, useSyncExternalStore } from "react";
import { ArrowUpRight } from "lucide-react";
import { SocialLink } from "@/components/SocialLink";
import { GmailIcon } from "@/components/BrandIcons";
import { contactContent, activeSocial } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { CallReveal } from "@/components/CallReveal";

const NOTICES: Record<string, string> = {
  limited: "Too many attempts from your connection. Try again in about 10 minutes.",
  unavailable: "That contact option isn't set up yet. Try another one below.",
};

const noop = () => () => { };
const readStatus = () => new URLSearchParams(window.location.search).get("contact");

export function Contact() {
  const status = useSyncExternalStore(noop, readStatus, () => null);
  const notice = status ? NOTICES[status] ?? null : null;

  useEffect(() => {
    if (!status) return;
    const params = new URLSearchParams(window.location.search);
    params.delete("contact");
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}#contact`);
  }, [status]);

  const email = activeSocial.find((s) => s.key === "email");

  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <Reveal as="div" className="container contact-inner reveal-fade">
        <p className="eyebrow">Get in touch</p>
        <h2 className="contact-heading" id="contact-title">{contactContent.title}</h2>
        <p className="contact-lede">
          {contactContent.tagline} {contactContent.lede}
        </p>

        <CallReveal>
          {email && (
            <a href={email.url} className="btn btn-primary contact-cta" target="_blank" rel="noreferrer">
              <GmailIcon size={16} />
              <span>Email me on Gmail</span>
              <ArrowUpRight className="contact-cta-arrow" size={16} aria-hidden="true" />
            </a>
          )}

          {notice && (
            <p className="contact-notice" role="status">
              {notice}
            </p>
          )}

          <ul className="contact-social" aria-label="Other ways to reach me">
            {activeSocial.map((link, i) => (
              <li className="reveal-item" style={{ "--i": i } as React.CSSProperties} key={link.key}>
                <SocialLink link={link} className="social-pill" />
              </li>
            ))}
          </ul>
        </CallReveal>
      </Reveal>
    </section>
  );
}
