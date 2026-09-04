import Image from "next/image";
import { SocialLinks } from "./SocialLinks";

export function SiteHeader() {
  return (
    <header className="bg-green border-b-4 border-ink">
      <div className="mx-auto max-w-6xl px-6 pt-8 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Image src="/logo-white.png" alt="Classical 615 logo" width={56} height={56} className="shrink-0" />
            <div>
              <h1 className="font-display text-2xl sm:text-3xl text-paper leading-none">Classical 615</h1>
              <p className="mt-1 font-body text-sm text-purple-pale">Your classical music hub in Nashville, TN</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6 font-body font-semibold text-sm uppercase tracking-widest text-paper">
              <a href="#events" className="hover:text-yellow transition-colors">This Week</a>
              <a href="#calendar" className="hover:text-yellow transition-colors">Calendar</a>
              <a href="https://airtable.com/appFeVe6brZ3ko9Ww/shr1yAX4CGBt7jAoR" target="_blank" rel="noreferrer" className="hover:text-yellow transition-colors">Submit an Event</a>
              <a href="https://abcnashville.org/donations/classical-615/" target="_blank" rel="noreferrer" className="rounded-full bg-yellow px-5 py-2 text-ink hover:bg-paper transition-colors">Donate</a>
            </nav>
            <SocialLinks />
          </div>
        </div>
      </div>
    </header>
  );
}
