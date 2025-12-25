"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "text-sm transition",
        active
          ? "text-foreground font-medium"
          : "text-muted-foreground hover:text-foreground",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-emerald-600" />
          <span className="text-base font-semibold tracking-tight">
            Savartan
          </span>
        </Link>

        {/* Links */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink href="/pets" label="Амьтад" />
          <NavLink href="/about" label="Бидний тухай" />
          <NavLink href="/how-it-works" label="Хэрхэн ажилладаг вэ" />
          <NavLink href="/contact" label="Холбоо барих" />
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/pets/new">Амьтан нийтлэх</Link>
          </Button>

          {/* Profile icon button */}
          <Button asChild variant="outline" size="icon" aria-label="Профайл">
            <Link href="/profile">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile links */}
      <div className="border-t bg-white md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
          <Link
            href="/pets"
            className="text-sm text-muted-foreground"
          >
            Амьтад
          </Link>
          <Link
            href="/about"
            className="text-sm text-muted-foreground"
          >
            Тухай
          </Link>
          <Link
            href="/how-it-works"
            className="text-sm text-muted-foreground"
          >
            Заавар
          </Link>
          <Link
            href="/contact"
            className="text-sm text-muted-foreground"
          >
            Холбоо
          </Link>
        </div>
      </div>
    </header>
  );
}
