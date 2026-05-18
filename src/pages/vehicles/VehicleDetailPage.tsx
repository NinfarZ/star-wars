import { Suspense } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { type Film, type Person, type Vehicle } from '../../types/swapi';
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

export default function VehicleDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <Navigate to="/vehicles" replace />;

  const { data: vehicle } = useSuspenseQuery<Vehicle>({
    queryKey: ['vehicle-detail', id],
    queryFn: async () => {
      const res = await fetch(`https://swapi.py4e.com/api/vehicles/${id}/`);
      return res.json();
    },
    staleTime: Infinity,
  });

  return (
    <div>
      <title>{vehicle.name} – Star Wars Data Explorer</title>
      <meta name="description" content={`${vehicle.name} — ${vehicle.model}, ${vehicle.vehicle_class}. Manufactured by ${vehicle.manufacturer}.`} />
      <Link
        to="/vehicles"
        className="text-[#FFE81F]/80 text-xs tracking-[0.25em] uppercase hover:text-[#FFE81F] mb-8 inline-block"
      >
        ← All Vehicles
      </Link>

      <section className="border border-[#FFE81F]/20 p-6">
        <h1 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5">
          {vehicle.name}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-5">
          <DetailRow label="Model" value={vehicle.model} />
          <DetailRow label="Manufacturer" value={vehicle.manufacturer} />
          <DetailRow label="Class" value={vehicle.vehicle_class} />
          <DetailRow label="Cost" value={vehicle.cost_in_credits !== 'unknown' ? `${vehicle.cost_in_credits} credits` : 'unknown'} />
          <DetailRow label="Length" value={vehicle.length !== 'unknown' ? `${vehicle.length.trim()} m` : 'unknown'} />
          <DetailRow label="Max Speed" value={vehicle.max_atmosphering_speed !== 'unknown' ? `${vehicle.max_atmosphering_speed} km/h` : 'unknown'} />
          <DetailRow label="Crew" value={vehicle.crew} />
          <DetailRow label="Passengers" value={vehicle.passengers} />
          <DetailRow label="Cargo Capacity" value={vehicle.cargo_capacity !== 'unknown' ? `${vehicle.cargo_capacity} kg` : 'unknown'} />
          <DetailRow label="Consumables" value={vehicle.consumables} />
        </div>

        {vehicle.films.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Films</h2>
            <Suspense fallback={<ItemsSkeleton count={vehicle.films.length} />}>
              <FilmsList urls={vehicle.films} />
            </Suspense>
          </div>
        )}

        {vehicle.pilots.length > 0 && (
          <div>
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Pilots</h2>
            <Suspense fallback={<ItemsSkeleton count={vehicle.pilots.length} />}>
              <PilotsList urls={vehicle.pilots} />
            </Suspense>
          </div>
        )}
      </section>
    </div>
  );
}
