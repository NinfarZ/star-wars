import { Suspense } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { type Film, type Person, type Planet } from '../../types/swapi';
import { useSuspenseQuery } from '@tanstack/react-query';
import { LinkedResourceList } from '../../components/LinkedResourceList';
import ItemsSkeleton from '../../components/ItemsSkeleton';

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className='capitalize'>
      <p className="text-gray-300 text-xs tracking-[0.25em] uppercase mb-1">{label}</p>
      <p className="text-gray-200 text-sm">{value}</p>
    </div>
  );
}

export default function PlanetDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <Navigate to="/planets" replace />;

  const { data: planet } = useSuspenseQuery<Planet>({
    queryKey: ['planet', id],
    queryFn: async () => {
      const res = await fetch(`https://swapi.py4e.com/api/planets/${id}/`);
      return res.json();
    },
    staleTime: Infinity,
  });

  return (
    <div>
      <title>{planet.name} – Star Wars Data Explorer</title>
      <meta name="description" content={`${planet.name} — ${planet.climate} climate, ${planet.terrain} terrain. Population: ${planet.population}.`} />
      <Link
        to="/planets"
        className="text-[#FFE81F]/80 text-xs tracking-[0.25em] uppercase hover:text-[#FFE81F] mb-8 inline-block"
      >
        ← All Planets
      </Link>

      <section className="border border-[#FFE81F]/20 p-6">
        <h1 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5">
          {planet.name}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-5">
          <DetailRow label="Climate" value={planet.climate} />
          <DetailRow label="Terrain" value={planet.terrain} />
          <DetailRow label="Population" value={planet.population} />
          <DetailRow label="Diameter" value={planet.diameter} />
          <DetailRow label="Gravity" value={planet.gravity} />
          <DetailRow label="Surface Water" value={planet.surface_water + "%"} />
          <DetailRow label="Rotation Period" value={planet.rotation_period} />
          <DetailRow label="Orbital Period" value={planet.orbital_period} />
        </div>

        {planet.films.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Films</h2>
            <Suspense fallback={<ItemsSkeleton count={planet.films.length} />}>
              <LinkedResourceList<Film> urls={planet.films} queryKey="film" routePath="films" getLabel={(film) => film.title} />
            </Suspense>
          </div>
        )}

        {planet.residents.length > 0 && (
          <div>
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Residents</h2>
            <Suspense fallback={<ItemsSkeleton count={planet.residents.length} />}>
              <LinkedResourceList<Person> urls={planet.residents} queryKey="person" routePath="people" getLabel={(person) => person.name} />
            </Suspense>
          </div>
        )}
      </section>
    </div>
  );
}
