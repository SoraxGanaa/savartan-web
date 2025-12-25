export default function PrivacyPage() {
  return (
    <div className="bg-linear-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-semibold">Privacy</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          We store basic account information and pet posts you create. Refresh tokens are stored securely as httpOnly cookies.
          We do not sell your data.
        </p>
      </div>
    </div>
  );
}
