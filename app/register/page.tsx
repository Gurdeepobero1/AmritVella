import Link from "next/link";
import { registerUser } from "@/lib/actions";
import { Card, Field, inputClass, SubmitButton } from "@/components/ui/primitives";

export default function RegisterPage() {
  const requiresCode = Boolean(process.env.REGISTRATION_CODE);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="border-b border-navy-950/10 p-6">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-saffron-600">AmritVella</div>
          <h1 className="mt-3 text-2xl font-semibold text-navy-950">Create private account</h1>
          <p className="mt-2 text-sm leading-6 text-steel-700">All tracker records are stored with your user ID.</p>
        </div>
        <form action={registerUser} className="space-y-4 p-6">
          <Field label="Name">
            <input className={inputClass} name="name" autoComplete="name" />
          </Field>
          <Field label="Email">
            <input className={inputClass} name="email" type="email" autoComplete="email" required />
          </Field>
          <Field label="Password" hint="Use at least 8 characters.">
            <input className={inputClass} name="password" type="password" autoComplete="new-password" required minLength={8} />
          </Field>
          {requiresCode ? (
            <Field label="Private setup code" hint="Required on deployed instances.">
              <input className={inputClass} name="registrationCode" type="password" required />
            </Field>
          ) : null}
          <SubmitButton>Create account</SubmitButton>
          <Link className="focus-ring block rounded-md text-sm font-medium text-navy-950 underline" href="/login">
            Back to sign in
          </Link>
        </form>
      </Card>
    </main>
  );
}
