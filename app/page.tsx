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
              Амьтан ол. Гудамжны амьтдад тусал. Ухаалгаар үрчил.
            </h1>
            <p className="mt-4 text-muted-foreground">
              Savartan нь амьтдыг зурагтайгаар нийтлэх, холбоо барих мэдээлэл
              хуваалцах, шинэ эзэнтэй болохыг нь хялбар болгоход тусална.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/pets">Амьтад үзэх</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/register">Бүртгэл үүсгэх</Link>
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border bg-white px-3 py-1">
                Аюулгүй нэвтрэлт
              </span>
              <span className="rounded-full border bg-white px-3 py-1">
                S3 зураг байршуулах
              </span>
              <span className="rounded-full border bg-white px-3 py-1">
                Эзэмшигчийн удирдлагатай зар
              </span>
            </div>
          </div>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Хурдан эхлэх</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <span className="font-medium text-foreground">1.</span> Бүртгэл
                үүсгэнэ
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-foreground">2.</span> Амьтнаа
                зурагтайгаар нийтэлнэ
              </div>
              <div className="flex gap-2">
                <span className="font-medium text-foreground">3.</span> Профайл
                хэсгээс заруудаа удирдана
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Value props */}
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            [
              "Энгийн нийтлэл",
              "Зураг оруулж, дэлгэрэнгүй мэдээлэл нэмээд хэдхэн минутын дотор нийтлэнэ.",
            ],
            [
              "Аюулгүй үрчлэлт",
              "Ил тод холбоо барих мэдээлэл, амьтны дэлгэрэнгүй нь луйвраас сэргийлнэ.",
            ],
            [
              "Профайл удирдлага",
              "Өөрийн мэдээлэл болон нийтэлсэн амьтдаа нэг дороос удирдана.",
            ],
          ].map(([title, desc]) => (
            <Card key={title} className="rounded-2xl">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {desc}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-2xl border bg-white p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Амьтанд туслахад бэлэн үү?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Өнөөдөр бүртгэл үүсгээд анхны амьтнаа зурагтайгаар нийтлээрэй.
              </p>
            </div>
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/pets/new">Амьтан нийтлэх</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
