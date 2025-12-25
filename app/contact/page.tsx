import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold">Contact</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Card className="rounded-2xl">
            <CardHeader><CardTitle>Support</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Email: support@savartan.dev <br />
              (Replace with real email later)
            </CardContent>
          </Card>
          <Card className="rounded-2xl">
            <CardHeader><CardTitle>Partnership</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Want to help shelters? Contact: partners@savartan.dev
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
