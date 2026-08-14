const INSTAGRAM_URL = "https://www.instagram.com/classical.615/";
const FACEBOOK_URL = "https://www.facebook.com/classical.615/";

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Classical 615 on Instagram"
        className="text-paper hover:opacity-70 transition-opacity"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.5" cy="6.5" r="1.4" fill="currentColor" />
        </svg>
      </a>
      <a
        href={FACEBOOK_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Classical 615 on Facebook"
        className="text-paper hover:opacity-70 transition-opacity"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path
            d="M13.5 21v-7h2.3l.3-2.7h-2.6V9.6c0-.8.2-1.3 1.3-1.3h1.4V5.9c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3v2.2H9v2.7h2.1v7h2.4Z"
            fill="currentColor"
          />
        </svg>
      </a>
    </div>
  );
}
