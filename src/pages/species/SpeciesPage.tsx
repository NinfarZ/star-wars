import { Suspense, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { type Species, type SwapiList } from '../../types/swapi';
import Pagination from '../../components/Pagination';
import { Link } from 'react-router';

function SpeciesCardSkeleton() {
  return (
    <div className="border border-[#FFE81F]/20 p-4 animate-pulse">
      <div className="h-4 bg-[#FFE81F]/10 rounded w-2/3 mb-3" />
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex justify-between gap-4">
            <div className="h-3 bg-gray-700/40 rounded w-1/4" />
            <div className="h-3 bg-gray-700/40 rounded w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SpeciesPageSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <SpeciesCardSkeleton key={i} />
      ))}
    </div>
  );
}

function SpeciesCard({ species }: { species: Species }) {
  const speciesId = species.url.split('/').at(-2);

  return (
    <div className="border relative border-[#FFE81F]/20 p-4 hover:border-[#FFE81F]/50">
      <Link to={`/species/${speciesId}`} className="absolute inset-0 z-10" />
      <h2 className="text-[#FFE81F] font-bold tracking-wide mb-3">{species.name}</h2>
      <dl className="text-sm space-y-1">
        {[
          ['Classification', species.classification],
          ['Designation', species.designation],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-gray-300 capitalize shrink-0">{label}</dt>
            <dd className="text-gray-300 capitalize text-right">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

interface SpeciesListProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

function SpeciesList({ page, setPage }: SpeciesListProps) {
  const { data } = useSuspenseQuery<SwapiList<Species>>({
    queryKey: ['species', page],
    queryFn: async () => {
      const res = await fetch(`https://swapi.py4e.com/api/species/?page=${page}`);
      return res.json();
    },
  });

  const totalPages = Math.ceil(data.count / 10);

  return (
    <>
      <p className="text-gray-300 text-xs mb-5">
        {data.count} species in the database
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.results.map((species) => (
          <SpeciesCard key={species.url} species={species} />
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

export default function SpeciesPage() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <title>Species – Star Wars Data Explorer</title>
      <meta name="description" content="Discover all alien species found throughout the Star Wars universe." />
      <h1 className="text-[#FFE81F] text-2xl font-bold tracking-[0.3em] uppercase mb-6">
        Species
      </h1>

      <Suspense fallback={<SpeciesPageSkeleton />}>
        <SpeciesList page={page} setPage={setPage} />
      </Suspense>
    </div>
  );
}
