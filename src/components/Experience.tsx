import { experienceContent } from "@/data/site";
import { HorizontalSpine } from "@/components/HorizontalSpine";
import { Reveal } from "@/components/Reveal";

export function Experience() {
  return (
    <section className="section exp-section" id="experience" aria-labelledby="experience-title">
      <div className="container">
        <div className="section-head">
          <div>
            <h2 className="slash-title" id="experience-title">/Experience</h2>
            <p className="section-title">{experienceContent.title}</p>
          </div>
        </div>
      </div>

      <Reveal as="div" className="exp-band">
        <HorizontalSpine>
          <ol className="exp-timeline">
            {experienceContent.items.map((item, i) => {
              const bigYear = item.years.match(/\d{4}/)?.[0] ?? item.years;
              const above = i % 2 === 0;
              return (
                <li
                  className="exp-tick"
                  data-kind={item.kind}
                  data-pos={above ? "above" : "below"}
                  style={{ "--i": i } as React.CSSProperties}
                  key={item.title}
                >
                  <span className="exp-tick-mark" aria-hidden="true" />
                  <span className="exp-tick-year" aria-hidden="true">{bigYear}</span>
                  <div className="exp-tick-content">
                    <span className="exp-kind">{item.kind}</span>
                    <h3 className="exp-title">{item.title}</h3>
                    <p className="exp-body">{item.body}</p>
                    <span className="exp-year">{item.years}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </HorizontalSpine>
      </Reveal>
    </section>
  );
}