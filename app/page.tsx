import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="bg-linear-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Hero */}
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Find pets. Help strays. Adopt smarter.
            </h1>
            <p className="mt-4 text-muted-foreground">
              Savartan helps people post pets with photos, share contact info, and connect adopters with animals who need homes.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/pets">Browse pets</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/register">Create account</Link>
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border bg-white px-3 py-1">Secure login</span>
              <span className="rounded-full border bg-white px-3 py-1">S3 photo uploads</span>
              <span className="rounded-full border bg-white px-3 py-1">Creator-managed posts</span>
            </div>
          </div>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Quick start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-2"><span className="font-medium text-foreground">1.</span> Register an account</div>
              <div className="flex gap-2"><span className="font-medium text-foreground">2.</span> Post a pet with photos</div>
              <div className="flex gap-2"><span className="font-medium text-foreground">3.</span> Manage posts in Profile</div>
            </CardContent>
          </Card>
        </div>

        {/* Value props */}
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            ["Simple posting", "Upload images, add details, and publish in minutes."],
            ["Safer adoption", "Clear contact info and pet details reduce scams and confusion."],
            ["Profile management", "Edit your info and manage your posted pets from one place."]
          ].map(([title, desc]) => (
            <Card key={title} className="rounded-2xl">
              <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">{desc}</CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-2xl border bg-white p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Ready to help a pet?</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Create an account and post your first pet with photos today.
              </p>
            </div>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/pets/new">Post pet</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
