import { Suspense } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { type Film, type Person, type Starship } from '../../types/swapi';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useLinkedResources } from '../../hooks/useLinkedResources';
import ItemsSkeleton from '../../components/ItemsSkeleton';

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-gray-300 text-xs tracking-[0.25em] uppercase mb-1">{label}</p>
      <p className="text-gray-200 text-sm">{value}</p>
    </div>
  );
}

const FilmsList = ({ urls }: { urls: string[] }) => {
  const results = useLinkedResources<Film>('film', urls);
  return (
    <ul className="text-gray-200 text-sm space-y-1">
      {results.map(({ data: film }, i) => {
        const id = urls[i].split('/').at(-2);
        return <li key={urls[i]}>- <Link to={`/films/${id}`} className="hover:text-[#FFE81F]">{film.title}</Link></li>;
      })}
    </ul>
  );
};

const PilotsList = ({ urls }: { urls: string[] }) => {
  const results = useLinkedResources<Person>('person', urls);
  return (
    <ul className="text-gray-200 text-sm space-y-1">
      {results.map(({ data: person }, i) => {
        const id = urls[i].split('/').at(-2);
        return <li key={urls[i]}>- <Link to={`/people/${id}`} className="hover:text-[#FFE81F]">{person.name}</Link></li>;
      })}
    </ul>
  );
};

export default function StarshipDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <Navigate to="/starships" replace />;

  const { data: starship } = useSuspenseQuery<Starship>({
    queryKey: ['starship-detail', id],
    queryFn: async () => {
      const res = await fetch(`https://swapi.py4e.com/api/starships/${id}/`);
      return res.json();
    },
    staleTime: Infinity,
  });

  return (
    <div>
      <title>{starship.name} – Star Wars Data Explorer</title>
      <meta name="description" content={`${starship.name} — ${starship.model}, ${starship.starship_class}. Manufactured by ${starship.manufacturer}.`} />
      <Link
        to="/starships"
        className="text-[#FFE81F]/80 text-xs tracking-[0.25em] uppercase hover:text-[#FFE81F] mb-8 inline-block"
      >
        ← All Starships
      </Link>

      <section className="border border-[#FFE81F]/20 p-6">
        <h1 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5">
          {starship.name}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-5">
          <DetailRow label="Model" value={starship.model} />
          <DetailRow label="Manufacturer" value={starship.manufacturer} />
          <DetailRow label="Class" value={starship.starship_class} />
          <DetailRow label="Cost" value={starship.cost_in_credits !== 'unknown' ? `${starship.cost_in_credits} credits` : 'unknown'} />
          <DetailRow label="Length" value={starship.length !== 'unknown' ? `${starship.length.trim()} m` : 'unknown'} />
          <DetailRow label="Max Speed" value={starship.max_atmosphering_speed !== 'unknown' ? `${starship.max_atmosphering_speed} km/h` : 'unknown'} />
          <DetailRow label="Crew" value={starship.crew} />
          <DetailRow label="Passengers" value={starship.passengers} />
          <DetailRow label="Cargo Capacity" value={starship.cargo_capacity !== 'unknown' ? `${starship.cargo_capacity} kg` : 'unknown'} />
          <DetailRow label="Consumables" value={starship.consumables} />
          <DetailRow label="Hyperdrive Rating" value={starship.hyperdrive_rating} />
          <DetailRow label="MGLT" value={starship.MGLT} />
        </div>

        {starship.films.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Films</h2>
            <Suspense fallback={<ItemsSkeleton count={starship.films.length} />}>
              <FilmsList urls={starship.films} />
            </Suspense>
          </div>
        )}

        {starship.pilots.length > 0 && (
          <div>
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Pilots</h2>
            <Suspense fallback={<ItemsSkeleton count={starship.pilots.length} />}>
              <PilotsList urls={starship.pilots} />
            </Suspense>
          </div>
        )}
      </section>
    </div>
  );
}
