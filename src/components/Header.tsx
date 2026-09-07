import { Link } from "react-router";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-2">
          <Link to="/" className="p-3 text-4xl font-bold text-white">
            FCTACTICS
          </Link>
        </div>
      </div>
    </header>
  );
}
