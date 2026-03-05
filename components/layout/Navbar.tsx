import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-zinc-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-zinc-900">
          Campus Nest
        </Link>
        <div className="flex gap-4">
          <Link href="/pg" className="text-zinc-600 hover:text-zinc-900">
            PGs
          </Link>
          <Link href="/rides" className="text-zinc-600 hover:text-zinc-900">
            Rides
          </Link>
          <Link href="/dashboard" className="text-zinc-600 hover:text-zinc-900">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
