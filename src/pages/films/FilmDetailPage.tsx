import { Suspense } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { type Film, type Person, type Planet, type Species, type Vehicle, type Starship } from '../../types/swapi';
import { useSuspenseQuery } from '@tanstack/react-query';
import { LinkedResourceList } from '../../components/LinkedResourceList';
import ItemsSkeleton from '../../components/ItemsSkeleton';

function DetailRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-gray-300 text-xs tracking-[0.25em] uppercase mb-1">{label}</p>
      <p className="text-gray-200 text-sm">{value}</p>
    </div>
  );
}

export default function FilmDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <Navigate to="/films" replace />;

  const { data: film } = useSuspenseQuery<Film>({
    queryKey: ['film', id],
    queryFn: async () => {
      const res = await fetch(`https://swapi.py4e.com/api/films/${id}/`);
      return res.json();
    },
  });

  return (
    <div>
      <title>{film.title} – Star Wars Data Explorer</title>
      <meta name="description" content={`Directed by ${film.director}. Released ${film.release_date}. ${film.opening_crawl.slice(0, 120).trim()}…`} />
      <Link
        to="/films"
        className="text-[#FFE81F]/80 text-xs tracking-[0.25em] uppercase hover:text-[#FFE81F] mb-8 inline-block"
      >
        ← All Films
      </Link>

      <div className="border border-[#FFE81F]/20 p-6">
        <h1 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5">
          {film.title}
        </h1>

        <p className="text-sm text-gray-400 mb-5">{film.opening_crawl}</p>

        <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5">
          Details
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-5">
          <DetailRow label="Director" value={film.director} />
          <DetailRow label="Producer" value={film.producer} />
          <DetailRow label="Released" value={film.release_date} />
        </div>

        {film.characters.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Characters</h2>
            <Suspense fallback={<ItemsSkeleton count={film.characters.length} />}>
              <LinkedResourceList<Person> urls={film.characters} queryKey="person" routePath="people" getLabel={(person) => person.name} />
            </Suspense>
          </div>
        )}

        {film.planets.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Planets</h2>
            <Suspense fallback={<ItemsSkeleton count={film.planets.length} />}>
              <LinkedResourceList<Planet> urls={film.planets} queryKey="planet" routePath="planets" getLabel={(planet) => planet.name} />
            </Suspense>
          </div>
        )}

        {film.species.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Species</h2>
            <Suspense fallback={<ItemsSkeleton count={film.species.length} />}>
              <LinkedResourceList<Species> urls={film.species} queryKey="species" routePath="species" getLabel={(species) => species.name} />
            </Suspense>
          </div>
        )}

        {film.starships.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Starships</h2>
            <Suspense fallback={<ItemsSkeleton count={film.starships.length} />}>
              <LinkedResourceList<Starship> urls={film.starships} queryKey="starship" routePath="starships" getLabel={(starship) => starship.name} />
            </Suspense>
          </div>
        )}

        {film.vehicles.length > 0 && (
          <div>
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Vehicles</h2>
            <Suspense fallback={<ItemsSkeleton count={film.vehicles.length} />}>
              <LinkedResourceList<Vehicle> urls={film.vehicles} queryKey="vehicle" routePath="vehicles" getLabel={(vehicle) => vehicle.name} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}

