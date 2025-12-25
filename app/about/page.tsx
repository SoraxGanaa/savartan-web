import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold">About Savartan</h1>
        <p className="mt-3 text-muted-foreground">
          Savartan connects animal lovers with pets in need — especially strays — and makes adoption safer and easier.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle>Our mission</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Reduce stray suffering by matching pets with caring people and promoting responsible adoption.
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader><CardTitle>What we provide</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Verified posts, photos, contact details, and clear pet info — all in one place.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
