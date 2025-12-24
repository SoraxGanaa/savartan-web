import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-0px)] bg-linear-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-14">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-600" />
            <span className="text-lg font-semibold">Savartan</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Register</Link>
            </Button>
          </div>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Find pets. Help strays. Adopt smarter.
            </h1>
            <p className="mt-4 text-muted-foreground">
              Register, login, and start posting pets with photos. Later we’ll add
              search, filters, and pet care advice like your design.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/register">Get started</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/login">I already have account</Link>
              </Button>
            </div>
          </div>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Setup order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <span className="font-medium text-foreground">1.</span>
                <span>Create 2–3 users (register)</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-foreground">2.</span>
                <span>Login (refresh cookie stored automatically)</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-foreground">3.</span>
                <span>Post pets + upload media</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
