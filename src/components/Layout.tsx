import { Outlet } from "react-router";
import Header from "./Header";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased">
      <Header />

      <main className="mx-auto my-6 w-full max-w-7xl flex-1 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-slate-100/60 py-6 text-center text-xs text-slate-500">
        © FCTACTICS. Data based on NEXON Open API.
      </footer>
    </div>
  );
}
