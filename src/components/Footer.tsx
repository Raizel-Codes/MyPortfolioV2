import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { SocialLink } from "@/components/SocialLink";
import { siteData, activeSocial } from "@/data/site";
import { Reveal } from "@/components/Reveal";

const FOOTER_NAV = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <Reveal as="div" className="footer-card reveal-fade">
          <div className="footer-brand">
            <p className="footer-name">
              {siteData.name.first}
              <br />
              {siteData.name.last}
            </p>
            <p className="footer-status">Available for opportunities</p>
          </div>

          <nav className="footer-col" aria-label="Footer navigation">
            <p className="footer-col-title">Navigate</p>
            <ul>
              {FOOTER_NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <p className="footer-col-title">Get in touch</p>
            <ul>
              {activeSocial.map((link) => (
                <li key={link.key}>
                  <SocialLink link={link} />
                </li>
              ))}
            </ul>
            <Link href="#top" className="footer-back-top">
              <ArrowUp size={14} aria-hidden="true" />
              Back to top
            </Link>
          </div>
        </Reveal>

        <p className="footer-copyright">© 2026 Adrian S. Garcia. Built with intent.</p>
      </div>
    </footer>
  );
}
