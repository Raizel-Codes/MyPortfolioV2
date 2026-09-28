import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Typewriter } from "@/components/Typewriter";
import { HeroMetrics } from "@/components/HeroMetrics";
import { GithubIcon } from "@/components/BrandIcons";
import { getGithubContributions } from "@/lib/github";
import { siteData } from "@/data/site";
import { CursorGlow } from "@/components/CursorGlow";
import { ParallaxWrap } from "@/components/ParallaxWrap";
import { MagneticLink } from "@/components/MagneticLink";
import { CountUp } from "@/components/CountUp";
import { TiltMedia } from "@/components/TiltMedia";
import { PauseOffscreen } from "@/components/PauseOffscreen";

export async function Hero() {
  const contributions = await getGithubContributions(siteData.githubUser);
  const profileUrl = `https://github.com/${siteData.githubUser}`;

  return (
    <section id="top" className="container hero">
      <CursorGlow />
      <h1 className="hero-name hero-in hero-in-1">
        <span className="hero-name-outline">{siteData.name.first}</span> {siteData.name.last}
      </h1>

      <div className="hero-stage">
        <div className="hero-intro">
          <p className="hero-role hero-in hero-in-2">
            <PauseOffscreen as="span">
              <Typewriter words={siteData.roles} />
            </PauseOffscreen>
          </p>
          <p className="hero-desc hero-in hero-in-3">{siteData.description}</p>
          <div className="hero-actions hero-in hero-in-4">
            <MagneticLink href="#projects" className="btn btn-primary">View Projects</MagneticLink>
            <MagneticLink href="#contact" className="btn btn-secondary">Get in Touch</MagneticLink>
          </div>
        </div>

        <ParallaxWrap className="hero-portrait hero-fade-in hero-in-2" strength={16}>
          <TiltMedia className="hero-portrait-tilt">
            <Image
              src="/assets/heroimage.jpg"
              alt="Adrian S. Garcia"
              fill
              sizes="(max-width: 900px) 60vw, 330px"
              priority
            />
          </TiltMedia>
        </ParallaxWrap>

        <div className="hero-side hero-in hero-in-3">
          {contributions !== null && (
            <a href={profileUrl} className="contrib" target="_blank" rel="noreferrer">
              <span className="contrib-head">
                <GithubIcon size={16} />
                GitHub
                <ArrowUpRight size={14} aria-hidden="true" />
              </span>
              <CountUp value={contributions} />
              <span className="contrib-label">contributions in the last year</span>
            </a>
          )}
          <HeroMetrics />
        </div>
      </div>
    </section>
  );
}