import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative z-30 border-t border-white/10 bg-[#050508] px-4 py-8 text-zinc-400 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎂</span>
          <span className="text-sm font-semibold text-white">WishCraft</span>
          <span className="text-xs text-zinc-400">
            — Send unforgettable surprise links.
          </span>
        </div>

        <div className="flex gap-6 text-xs">
          <Link href="/wishes" className="hover:text-white transition-colors">
            Templates
          </Link>
          <Link href="/pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
        </div>

        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} WishCraft. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
