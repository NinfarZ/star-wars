import { NavLink } from 'react-router';

const NAV_ITEMS = [
  { to: '/films', label: 'Films' },
  { to: '/people', label: 'Characters' },
  { to: '/planets', label: 'Planets' },
  { to: '/species', label: 'Species' },
  { to: '/vehicles', label: 'Vehicles' },
  { to: '/starships', label: 'Starships' },
];

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#FFE81F]/20 bg-black/90">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <NavLink
          to="/"
          className="text-[#FFE81F] font-black text-lg tracking-[0.35em] uppercase"
        >
          Star Wars
        </NavLink>

        <nav className="flex gap-6">
          {NAV_ITEMS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-xs tracking-[0.2em] uppercase ${
                  isActive
                    ? 'text-[#FFE81F]'
                    : 'text-gray-200 hover:text-[#FFE81F]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
