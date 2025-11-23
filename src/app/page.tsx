import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-green-50 dark:bg-green-950">
      {/* Section 1: Hero */}
      <section className="flex min-h-[50vh] flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl text-green-950 dark:text-green-50">
          Freelance with Total Autonomy
        </h1>
        <p className="mt-6 max-w-[600px] text-lg text-green-900/80 dark:text-green-100/80">
          Get paid by the hour, minute, or any period you want.
          Powered by Massa autonomous smart contracts for ultimate flexibility.
        </p>
        <div className="mt-10 flex gap-4">
          <Link
            href="/dashboard"
            className="rounded-full bg-green-600 px-8 py-3 text-sm font-medium text-white hover:bg-green-700 dark:bg-green-500 dark:text-white dark:hover:bg-green-400"
          >
            Start Working
          </Link>
          <Link
            href="/hire"
            className="rounded-full border border-green-200 px-8 py-3 text-sm font-medium text-green-900 hover:bg-green-100 dark:border-green-800 dark:text-green-100 dark:hover:bg-green-900/50"
          >
            Hire Talent
          </Link>
        </div>
      </section>

      {/* Section 2: Trust & Transparency */}
      <section className="flex min-h-[50vh] flex-col items-center justify-center bg-green-100/50 px-6 py-24 text-center dark:bg-green-900/20">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-green-950 dark:text-green-50">
            Verified Proof of Funds
          </h2>
          <p className="mt-6 text-lg text-green-900/80 dark:text-green-100/80">
            Never work for free again. With our Massa autonomous smart contracts,
            you can verify your employer's ability to pay in real-time.
            Everything is on-chain, transparent, and guaranteed.
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-green-950/50">
              <h3 className="font-semibold text-green-950 dark:text-green-50">Transparent</h3>
              <p className="mt-2 text-sm text-green-900/70 dark:text-green-100/70">See the funds locked in the contract.</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-green-950/50">
              <h3 className="font-semibold text-green-950 dark:text-green-50">Autonomous</h3>
              <p className="mt-2 text-sm text-green-900/70 dark:text-green-100/70">Payments execute automatically.</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-green-950/50">
              <h3 className="font-semibold text-green-950 dark:text-green-50">Flexible</h3>
              <p className="mt-2 text-sm text-green-900/70 dark:text-green-100/70">Choose your payment interval.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
