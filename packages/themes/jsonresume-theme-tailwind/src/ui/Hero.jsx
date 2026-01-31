import { Avatar, AvatarImage, AvatarFallback } from './Avatar.jsx';
import { Button } from './Button.jsx';
import { CiMail, CiPhone, CiGlobe } from 'react-icons/ci';
import { FaGithub, FaTwitter } from 'react-icons/fa';

const socials = {
  github: FaGithub,
  twitter: FaTwitter,
};

const HeroComponent = ({ basics }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 space-y-1.5">
        <h1 className="text-2xl font-bold">{basics.name}</h1>
        <p className="max-w-md text-pretty font-mono text-sm text-muted-foreground">
          {basics.label}
        </p>
        {basics.location?.city && (
          <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
            <span className="inline-flex gap-x-1.5 align-baseline leading-none">
              <CiGlobe />
              {basics.location.city}
            </span>
          </p>
        )}
        <div className="flex gap-x-1 pt-1 font-mono text-sm text-muted-foreground print:hidden">
          {basics.email ? (
            <Button className="size-8" variant="outline" size="icon" asChild>
              <a href={`mailto:${basics.email}`}>
                <CiMail className="size-4" />
              </a>
            </Button>
          ) : null}
          {basics.phone ? (
            <Button className="size-8" variant="outline" size="icon" asChild>
              <a href={`tel:${basics.phone}`}>
                <CiPhone className="size-4" />
              </a>
            </Button>
          ) : null}
          {basics.profiles?.map((social) => {
            const SocialIcon = socials[social.network];
            return (
              <Button
                key={social.username}
                className="size-8"
                variant="outline"
                size="icon"
                asChild
              >
                <a href={social.url}>
                  <SocialIcon className="size-4" />
                </a>
              </Button>
            );
          })}
        </div>
        <div className="hidden flex-col gap-x-1 font-mono text-sm text-muted-foreground print:flex">
          {basics.email ? (
            <a href={`mailto:${basics.email}`}>
              <span className="underline">{basics.email}</span>
            </a>
          ) : null}
          {basics.phone ? (
            <a href={`tel:${basics.phone}`}>
              <span className="underline">{basics.phone}</span>
            </a>
          ) : null}
        </div>
      </div>
      <Avatar className="size-28">
        <AvatarImage alt={basics.name} src={basics.image} />
        <AvatarFallback>{'TD'}</AvatarFallback>
      </Avatar>
    </div>
  );
};

export default HeroComponent;
