import { Suspense } from "react";
import { useParams, Link, Navigate } from "react-router";
import { type Film, type Person, type Species, type Vehicle, type Starship } from "../../types/swapi";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLinkedResources } from "../../hooks/useLinkedResources";
import ItemsSkeleton from "../../components/ItemsSkeleton";

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="capitalize">
      <p className="text-gray-300 text-xs tracking-[0.25em] uppercase mb-1">
        {label}
      </p>
      <p className=" text-sm">{value}</p>
    </div>
  );
}

const FilmsList = ({ urls }: { urls: string[] }) => {
  const results = useLinkedResources<Film>('film', urls);
  return (
    <ul className=" text-sm space-y-1">
      {results.map(({ data: film }, i) => {
        const id = urls[i].split('/').at(-2);
        return <li key={urls[i]}>- <Link to={`/films/${id}`} className="hover:text-[#FFE81F]">{film.title}</Link></li>;
      })}
    </ul>
  );
};

const PersonSpeciesList = ({ urls }: { urls: string[] }) => {
  const results = useLinkedResources<Species>('species', urls);
  return (
    <ul className=" text-sm space-y-1">
      {results.map(({ data: species }, i) => {
        const id = urls[i].split('/').at(-2);
        return <li key={urls[i]}>- <Link to={`/species/${id}`} className="hover:text-[#FFE81F]">{species.name}</Link></li>;
      })}
    </ul>
  );
};

const PersonVehiclesList = ({ urls }: { urls: string[] }) => {
  const results = useLinkedResources<Vehicle>('vehicle', urls);
  return (
    <ul className=" text-sm space-y-1">
      {results.map(({ data: vehicle }, i) => {
        const id = urls[i].split('/').at(-2);
        return <li key={urls[i]}>- <Link to={`/vehicles/${id}`} className="hover:text-[#FFE81F]">{vehicle.name}</Link></li>;
      })}
    </ul>
  );
};

const PersonStarshipsList = ({ urls }: { urls: string[] }) => {
  const results = useLinkedResources<Starship>('starship', urls);
  return (
    <ul className=" text-sm space-y-1">
      {results.map(({ data: starship }, i) => {
        const id = urls[i].split('/').at(-2);
        return <li key={urls[i]}>- <Link to={`/starships/${id}`} className="hover:text-[#FFE81F]">{starship.name}</Link></li>;
      })}
    </ul>
  );
};

export default function PeopleDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <Navigate to="/people" replace />;

  const { data: person } = useSuspenseQuery<Person>({
    queryKey: ["person", id],
    queryFn: async () => {
      const res = await fetch(`https://swapi.py4e.com/api/people/${id}/`);
      return res.json();
    },
    staleTime: Infinity, // person details don't change, so we can cache indefinitely
  });

  return (
    <div>
      <title>{person.name} – Star Wars Data Explorer</title>
      <meta name="description" content={`${person.name} — born ${person.birth_year}, ${person.gender}, ${person.height} cm. Star Wars character profile.`} />
      <Link
        to="/people"
        className="text-[#FFE81F]/80 text-xs tracking-[0.25em] uppercase hover:text-[#FFE81F] mb-8 inline-block"
      >
        ← All People
      </Link>

      {/* Metadata grid */}
      <section className="border border-[#FFE81F]/20 p-6">
        <h1 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5">
          {person.name}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-5">
          <DetailRow label="Height" value={person.height} />
          <DetailRow label="Mass" value={person.mass} />
          <DetailRow label="Hair Color" value={person.hair_color} />
          <DetailRow label="Skin Color" value={person.skin_color} />
          <DetailRow label="Eye Color" value={person.eye_color} />
          <DetailRow label="Birth Year" value={person.birth_year} />
          <DetailRow label="Gender" value={person.gender} />
        </div>

        <div>
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5">Films</h2>
          <Suspense fallback={<ItemsSkeleton count={person.films.length} />}>
            <FilmsList urls={person.films} />
          </Suspense>
        </div>

        {person.species.length > 0 && (
          <div>
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5 mt-5">Species</h2>
            <Suspense fallback={<ItemsSkeleton count={person.species.length} />}>
              <PersonSpeciesList urls={person.species} />
            </Suspense>
          </div>
        )}

        {person.vehicles.length > 0 && (
          <div>
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5 mt-5">Vehicles</h2>
            <Suspense fallback={<ItemsSkeleton count={person.vehicles.length} />}>
              <PersonVehiclesList urls={person.vehicles} />
            </Suspense>
          </div>
        )}

        {person.starships.length > 0 && (
          <div>
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5 mt-5">Starships</h2>
            <Suspense fallback={<ItemsSkeleton count={person.starships.length} />}>
              <PersonStarshipsList urls={person.starships} />
            </Suspense>
          </div>
        )}
      </section>
    </div>
  );
}



