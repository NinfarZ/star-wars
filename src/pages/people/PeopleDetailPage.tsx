import { Suspense } from "react";
import { useParams, Link, Navigate } from "react-router";
import { type Film, type Person, type Species, type Vehicle, type Starship } from "../../types/swapi";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LinkedResourceList } from '../../components/LinkedResourceList';
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

export default function PeopleDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <Navigate to="/people" replace />;

  const { data: person } = useSuspenseQuery<Person>({
    queryKey: ["person", id],
    queryFn: async () => {
      const res = await fetch(`https://swapi.py4e.com/api/people/${id}/`);
      return res.json();
    },
    staleTime: Infinity,
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
            <LinkedResourceList<Film> urls={person.films} queryKey="film" routePath="films" getLabel={(film) => film.title} />
          </Suspense>
        </div>

        {person.species.length > 0 && (
          <div>
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5 mt-5">Species</h2>
            <Suspense fallback={<ItemsSkeleton count={person.species.length} />}>
              <LinkedResourceList<Species> urls={person.species} queryKey="species" routePath="species" getLabel={(species) => species.name} />
            </Suspense>
          </div>
        )}

        {person.vehicles.length > 0 && (
          <div>
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5 mt-5">Vehicles</h2>
            <Suspense fallback={<ItemsSkeleton count={person.vehicles.length} />}>
              <LinkedResourceList<Vehicle> urls={person.vehicles} queryKey="vehicle" routePath="vehicles" getLabel={(vehicle) => vehicle.name} />
            </Suspense>
          </div>
        )}

        {person.starships.length > 0 && (
          <div>
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5 mt-5">Starships</h2>
            <Suspense fallback={<ItemsSkeleton count={person.starships.length} />}>
              <LinkedResourceList<Starship> urls={person.starships} queryKey="starship" routePath="starships" getLabel={(starship) => starship.name} />
            </Suspense>
          </div>
        )}
      </section>
    </div>
  );
}



