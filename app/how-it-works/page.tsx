import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorksPage() {
  return (
    <div className="bg-linear-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold">How it works</h1>

        <div className="mt-8 grid gap-4">
          {[
            ["Register & login", "Create an account. Your session is secured using access + refresh tokens."],
            ["Post a pet", "Upload images, add details, and publish your post."],
            ["Connect", "Interested adopters can contact you using the contact info you provide."],
            ["Adopt responsibly", "Meet safely, verify details, and ensure the pet goes to a good home."]
          ].map(([title, desc]) => (
            <Card key={title} className="rounded-2xl">
              <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">{desc}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
