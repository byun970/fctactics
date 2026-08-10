import { Link, NavLink } from "react-router";

const NAV_ITEMS = [
  { path: "/search", label: "전적검색" },
  { path: "/tierlist", label: "선수 티어리스트" },
];

export default function Header() {
  return (
    <header>
      <div className="flex items-center gap-2 bg-blue-500">
        <Link to="/" className="p-3 text-4xl font-bold text-white">
          FCTACTICS
        </Link>
        <nav className="flex gap-4">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-white transition-colors hover:text-blue-100 ${
                  isActive ? "font-bold underline" : "opacity-90"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
