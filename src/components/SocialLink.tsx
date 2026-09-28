import { GithubIcon, GmailIcon, FacebookIcon, LinkedinIcon } from "@/components/BrandIcons";
import type { siteData } from "@/data/site";

type Social = (typeof siteData.social)[number];

const ICONS = {
  github: GithubIcon,
  email: GmailIcon,
  facebook: FacebookIcon,
  linkedin: LinkedinIcon,
};

export function SocialLink({ link, className, iconOnly = false }: { link: Social; className?: string; iconOnly?: boolean }) {
  const Icon = ICONS[link.key];
  return (
    <a
      href={link.url}
      className={className}
      target="_blank"
      rel="noreferrer"
      aria-label={iconOnly ? link.label : undefined}
      title={iconOnly ? link.label : undefined}
    >
      <Icon size={16} />
      {!iconOnly && link.label}
    </a>
  );
}
