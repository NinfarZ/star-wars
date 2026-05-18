import { Suspense, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { type Person, type SwapiList } from '../../types/swapi';
import Pagination from '../../components/Pagination';
import { Link } from 'react-router';

function PersonCardSkeleton() {
  return (
    <div className="border border-[#FFE81F]/20 p-4 animate-pulse">
      <div className="h-4 bg-[#FFE81F]/10 rounded w-2/3 mb-3" />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex justify-between gap-4">
            <div className="h-3 bg-gray-700/40 rounded w-1/4" />
            <div className="h-3 bg-gray-700/40 rounded w-1/3" />
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-[#FFE81F]/10">
        <div className="h-3 bg-gray-700/40 rounded w-1/4" />
      </div>
    </div>
  );
}

function PeoplePageSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <PersonCardSkeleton key={i} />
      ))}
    </div>
  );
}

function PersonCard({ person, index }: { person: Person; index: number }) {
  return (
    <div className="border relative border-[#FFE81F]/20 p-4 hover:border-[#FFE81F]/50">
      <Link to={`/people/${index + 1}`} className="absolute inset-0 z-10" />
      <h2 className="text-[#FFE81F] font-bold tracking-wide mb-3">{person.name}</h2>
      <dl className="text-sm space-y-1">
        {[
          ['Born', person.birth_year],
          ['Gender', person.gender],
          ['Height', person.height + ' cm'],
          ['Mass', person.mass + ' kg'],
          ['Hair', person.hair_color],
          ['Eyes', person.eye_color],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-gray-300 capitalize shrink-0">{label}</dt>
            <dd className="text-gray-300 capitalize text-right">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 pt-3 border-t border-[#FFE81F]/10 text-xs text-gray-300">
        {person.films.length} film{person.films.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

interface PeopleListProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

function PeopleList({ page, setPage }: PeopleListProps) {
  const { data, isError } = useSuspenseQuery<SwapiList<Person>>({
    queryKey: ['people', page],
    queryFn: async () => {
      const res = await fetch(`https://swapi.py4e.com/api/people/?page=${page}`);
      return res.json();
    },
  });

  const totalPages = Math.ceil(data.count / 10);

  return (
    <>
      <p className="text-gray-300 text-xs mb-5">
        {data.count} result{data.count !== 1 ? 's' : ''}
      </p>

      {isError ? (
        <p className="text-red-500 text-sm text-center py-12">Failed to load characters.</p>
      ) : data.results.length === 0 ? (
        <p className="text-gray-300 text-sm text-center py-12">No characters found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.results.map((person, index) => (
            <PersonCard key={person.url} person={person} index={index} />
          ))}
        </div>
      )}

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

export default function PeoplePage() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <title>People – Star Wars Data Explorer</title>
      <meta name="description" content="Browse every character from the Star Wars universe." />
      <h1 className="text-[#FFE81F] text-2xl font-bold tracking-[0.3em] uppercase mb-6">
        Characters
      </h1>

      <Suspense fallback={<PeoplePageSkeleton />}>
        <PeopleList  page={page} setPage={setPage} />
      </Suspense>
    </div>
  );
}
