import { aboutContent } from "@/data/site";
import { Reveal } from "@/components/Reveal";
import { LetterReveal } from "@/components/LetterReveal";

export function About() {
  const [first, second] = aboutContent.paragraphs;

  return (
    <section className="section" id="about" aria-labelledby="about-title">
      <Reveal as="div" className="container about-grid reveal-fade">
        <div>
          <h2 className="slash-title" id="about-title">/About</h2>
          <p className="about-statement">{aboutContent.title}</p>
        </div>
        <LetterReveal>
          <div className="about-body">
            <p>
              {first} <strong>{aboutContent.emphasis}</strong>
            </p>
            <p>{second}</p>
          </div>
          <dl className="facts">
            {aboutContent.facts.map((fact, i) => (
              <div key={fact.label} style={{ "--i": i } as React.CSSProperties}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </LetterReveal>
      </Reveal>
    </section>
  );
}