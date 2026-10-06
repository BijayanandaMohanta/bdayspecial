"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/wishes", label: "Explore Wishes" },
  { href: "/prompts", label: "Prompts & Ideas" },
  { href: "/pricing", label: "Pricing" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 text-xl shadow-lg shadow-pink-500/20 transition-transform duration-300 group-hover:scale-105">
            🎂
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-wider text-white">
              WishCraft
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-rose-400">
              Interactive Wishes
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? "text-rose-400"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all duration-300 hover:scale-[1.03] active:scale-95"
          >
            <span>✨</span>
            <span>Create a Wish</span>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl p-2 text-zinc-400 hover:text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-b border-white/10 bg-black/95 px-5 pb-6 pt-3 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-3 py-2 text-base text-zinc-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/create"
              onClick={() => setIsOpen(false)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 py-3 text-sm font-semibold text-white"
            >
              <span>✨</span>
              <span>Create a Wish</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
