import { Suspense, useState } from 'react';
import { Link } from 'react-router';
import { type Planet, type SwapiList } from '../../types/swapi';
import Pagination from '../../components/Pagination';
import { useSuspenseQuery } from '@tanstack/react-query';

function PlanetCardSkeleton() {
  return (
    <div className="border border-[#FFE81F]/20 p-5 animate-pulse">
      <div className="h-4 bg-[#FFE81F]/10 rounded w-2/3 mb-4" />
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="h-2.5 bg-gray-700/40 rounded w-1/2 mb-1" />
            <div className="h-3 bg-gray-700/40 rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PlanetsPageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <PlanetCardSkeleton key={i} />
      ))}
    </div>
  );
}

function fmt(val: string, suffix = ''): string {
  if (!val || val === 'unknown' || val === 'indefinite') return '–';
  const number = Number(val);
  return isNaN(number) ? val : `${number.toLocaleString()}${suffix}`;
}

function PlanetCard({ planet }: { planet: Planet }) {
  const planetId = planet.url.split('/').at(-2);
  return (
    <Link to={`/planets/${planetId}`} className="border border-[#FFE81F]/20 p-5 hover:border-[#FFE81F]/50 block">
      <h2 className="text-[#FFE81F] font-bold text-lg tracking-wide mb-4">{planet.name}</h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {[
          ['Climate', planet.climate],
          ['Terrain', planet.terrain],
          ['Population', fmt(planet.population)],
          ['Diameter', fmt(planet.diameter, ' km')],
          ['Gravity', planet.gravity !== 'unknown' ? planet.gravity : '–'],
          ['Surface water', fmt(planet.surface_water, '%')],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-gray-300 text-xs uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-gray-300 capitalize truncate">{value}</p>
          </div>
        ))}
      </div>
    </Link>
  );
}

interface PlanetListProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

function PlanetList({ page, setPage }: PlanetListProps) {
  const { data } = useSuspenseQuery<SwapiList<Planet>>({
    queryKey: ['planets', page],
    queryFn: async () => {
      const res = await fetch(`https://swapi.py4e.com/api/planets/?page=${page}`);
      return res.json();
    },
  });
  const totalPages = Math.ceil(data.count / 10);

  return (
    <>
      <p className="text-gray-300 text-xs mb-5">{data.count} planets in the database</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.results.map((planet) => (
          <PlanetCard key={planet.url} planet={planet} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />
      )}
    </>
  );
}

export default function PlanetsPage() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <title>Planets – Star Wars Data Explorer</title>
      <meta name="description" content="Explore all planets and worlds from the Star Wars galaxy." />
      <h1 className="text-[#FFE81F] text-2xl font-bold tracking-[0.3em] uppercase mb-8">
        Planets
      </h1>

      <Suspense fallback={<PlanetsPageSkeleton />}>
        <PlanetList page={page} setPage={setPage} />
      </Suspense>
    </div>
  );
}
