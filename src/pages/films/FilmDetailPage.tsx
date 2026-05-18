import { Suspense } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { type Film, type Person, type Planet, type Species, type Vehicle, type Starship } from '../../types/swapi';
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

const CharactersList = ({ urls }: { urls: string[] }) => {
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

const PlanetsList = ({ urls }: { urls: string[] }) => {
  const results = useLinkedResources<Planet>('planet', urls);
  return (
    <ul className="text-gray-200 text-sm space-y-1">
      {results.map(({ data: planet }, i) => {
        const id = urls[i].split('/').at(-2);
        return <li key={urls[i]}>- <Link to={`/planets/${id}`} className="hover:text-[#FFE81F]">{planet.name}</Link></li>;
      })}
    </ul>
  );
};

const SpeciesList = ({ urls }: { urls: string[] }) => {
  const results = useLinkedResources<Species>('species', urls);
  return (
    <ul className="text-gray-200 text-sm space-y-1">
      {results.map(({ data: species }, i) => {
        const id = urls[i].split('/').at(-2);
        return <li key={urls[i]}>- <Link to={`/species/${id}`} className="hover:text-[#FFE81F]">{species.name}</Link></li>;
      })}
    </ul>
  );
};

const StarshipsList = ({ urls }: { urls: string[] }) => {
  const results = useLinkedResources<Starship>('starship', urls);
  return (
    <ul className="text-gray-200 text-sm space-y-1">
      {results.map(({ data: starship }, i) => {
        const id = urls[i].split('/').at(-2);
        return <li key={urls[i]}>- <Link to={`/starships/${id}`} className="hover:text-[#FFE81F]">{starship.name}</Link></li>;
      })}
    </ul>
  );
};

const VehiclesList = ({ urls }: { urls: string[] }) => {
  const results = useLinkedResources<Vehicle>('vehicle', urls);
  return (
    <ul className="text-gray-200 text-sm space-y-1">
      {results.map(({ data: vehicle }, i) => {
        const id = urls[i].split('/').at(-2);
        return <li key={urls[i]}>- <Link to={`/vehicles/${id}`} className="hover:text-[#FFE81F]">{vehicle.name}</Link></li>;
      })}
    </ul>
  );
};

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
              <CharactersList urls={film.characters} />
            </Suspense>
          </div>
        )}

        {film.planets.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Planets</h2>
            <Suspense fallback={<ItemsSkeleton count={film.planets.length} />}>
              <PlanetsList urls={film.planets} />
            </Suspense>
          </div>
        )}

        {film.species.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Species</h2>
            <Suspense fallback={<ItemsSkeleton count={film.species.length} />}>
              <SpeciesList urls={film.species} />
            </Suspense>
          </div>
        )}

        {film.starships.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Starships</h2>
            <Suspense fallback={<ItemsSkeleton count={film.starships.length} />}>
              <StarshipsList urls={film.starships} />
            </Suspense>
          </div>
        )}

        {film.vehicles.length > 0 && (
          <div>
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Vehicles</h2>
            <Suspense fallback={<ItemsSkeleton count={film.vehicles.length} />}>
              <VehiclesList urls={film.vehicles} />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}

