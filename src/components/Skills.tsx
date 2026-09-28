import { Gauge, Boxes, Orbit, Compass } from "lucide-react";
import { BrandLogo } from "@/components/BrandIcons";
import { stackContent } from "@/data/site";
import { RevealScroller } from "@/components/RevealScroller";
import { TickerTrack } from "@/components/TickerTrack";

// One pass of every tool across all areas, deduped by slug, for the icon grid + ticker.
const tickerTools = stackContent.areas
  .flatMap((area) => area.tools)
  .filter((tool, index, all) => all.findIndex((t) => t.slug === tool.slug) === index);

const LEVEL_DOTS: Record<string, number> = { core: 3, working: 2, learning: 1 };
const LEVEL_LABEL: Record<string, string> = {
  core: "Daily driver",
  working: "Comfortable",
  learning: "Learning",
};

export function Skills() {
  return (
    <section className="section" id="stack" aria-labelledby="stack-title">
      <div className="container">
        <div className="section-head">
          <div>
            <h2 className="slash-title" id="stack-title">/Stack</h2>
            <p className="section-title">{stackContent.title}</p>
            <p className="section-lede">{stackContent.lede}</p>
          </div>
        </div>

        <RevealScroller as="div" className="stack-grid">
          <div className="stack-card">
            <div className="stack-card-head">
              <span className="stack-card-icon" aria-hidden="true">
                <Gauge size={14} />
              </span>
              <span className="stack-card-title">Skills &amp; Expertise</span>
            </div>
            <ul className="skill-list">
              {stackContent.skills.map((skill, i) => (
                <li className="skill-row" style={{ "--i": i } as React.CSSProperties} key={skill.name}>
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-meter" aria-hidden="true">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="skill-dot"
                        style={{ "--dot-i": dot } as React.CSSProperties}
                        data-filled={dot < LEVEL_DOTS[skill.level]}
                      />
                    ))}
                  </span>
                  <span className="sr-only">{LEVEL_LABEL[skill.level]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="stack-card">
            <div className="stack-card-head">
              <span className="stack-card-icon" aria-hidden="true">
                <Boxes size={14} />
              </span>
              <span className="stack-card-title">Tech Stack</span>
            </div>
            <ul className="tech-grid">
              {tickerTools.map((tool, i) => (
                <li className="tech-tile" style={{ "--i": i } as React.CSSProperties} key={tool.slug}>
                  <BrandLogo slug={tool.slug} size={20} />
                  <span>{tool.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="stack-card">
            <div className="stack-card-head">
              <span className="stack-card-icon" aria-hidden="true">
                <Orbit size={14} />
              </span>
              <span className="stack-card-title">Design Philosophy</span>
            </div>
            <div className="philosophy-orbit">
              <span className="philosophy-ring" aria-hidden="true" />
              <span className="philosophy-center" aria-hidden="true">
                <Compass size={20} />
              </span>
              {stackContent.philosophy.map((item, i) => (
                <span className={`philosophy-node philosophy-node-${i}`} style={{ "--i": i } as React.CSSProperties} key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </RevealScroller>
      </div>

      <div className="ticker" aria-hidden="true">
        <TickerTrack>
          {[...tickerTools, ...tickerTools].map((tool, i) => (
            <span className="ticker-item" key={i}>
              <BrandLogo slug={tool.slug} size={16} />
              {tool.name}
            </span>
          ))}
        </TickerTrack>
      </div>
      <p className="sr-only">Core stack: {tickerTools.map((t) => t.name).join(", ")}</p>
    </section>
  );
}