import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-emerald-600" />
              <span className="font-semibold">Savartan</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Helping pets find safe homes across Mongolia.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link className="text-muted-foreground hover:text-foreground" href="/about">About</Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/how-it-works">How it works</Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/contact">Contact</Link>
            <Link className="text-muted-foreground hover:text-foreground" href="/privacy">Privacy</Link>
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Savartan. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
