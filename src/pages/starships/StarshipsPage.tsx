import { Suspense, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { type Starship, type SwapiList } from '../../types/swapi';
import Pagination from '../../components/Pagination';
import { Link } from 'react-router';

function StarshipCardSkeleton() {
  return (
    <div className="border border-[#FFE81F]/20 p-4 animate-pulse">
      <div className="h-4 bg-[#FFE81F]/10 rounded w-2/3 mb-3" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between gap-4">
            <div className="h-3 bg-gray-700/40 rounded w-1/4" />
            <div className="h-3 bg-gray-700/40 rounded w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

function StarshipsPageSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <StarshipCardSkeleton key={i} />
      ))}
    </div>
  );
}

function StarshipCard({ starship }: { starship: Starship }) {
  const starshipId = starship.url.split('/').at(-2);

  return (
    <div className="border relative border-[#FFE81F]/20 p-4 hover:border-[#FFE81F]/50">
      <Link to={`/starships/${starshipId}`} className="absolute inset-0 z-10" />
      <h2 className="text-[#FFE81F] font-bold tracking-wide mb-3">{starship.name}</h2>
      <dl className="text-sm space-y-1">
        {[
          ['Model', starship.model],
          ['Class', starship.starship_class],
          ['Crew', starship.crew],
          ['Passengers', starship.passengers],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-gray-300 capitalize shrink-0">{label}</dt>
            <dd className="text-gray-300 capitalize text-right">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 pt-3 border-t border-[#FFE81F]/10 text-xs text-gray-300">
        {starship.films.length} film{starship.films.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

interface StarshipsListProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

function StarshipsList({ page, setPage }: StarshipsListProps) {
  const { data } = useSuspenseQuery<SwapiList<Starship>>({
    queryKey: ['starships', page],
    queryFn: async () => {
      const res = await fetch(`https://swapi.py4e.com/api/starships/?page=${page}`);
      return res.json();
    },
  });

  const totalPages = Math.ceil(data.count / 10);

  return (
    <>
      <p className="text-gray-300 text-xs mb-5">
        {data.count} starship{data.count !== 1 ? 's' : ''} in the database
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.results.map((starship) => (
          <StarshipCard key={starship.url} starship={starship} />
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

export default function StarshipsPage() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <title>Starships – Star Wars Data Explorer</title>
      <meta name="description" content="Explore all starships and capital ships from across the Star Wars galaxy." />
      <h1 className="text-[#FFE81F] text-2xl font-bold tracking-[0.3em] uppercase mb-6">
        Starships
      </h1>
      <Suspense fallback={<StarshipsPageSkeleton />}>
        <StarshipsList page={page} setPage={setPage} />
      </Suspense>
    </div>
  );
}
