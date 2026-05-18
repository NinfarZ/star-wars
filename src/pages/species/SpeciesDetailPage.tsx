import { Suspense } from "react";
import { useParams, Link, Navigate } from "react-router";
import { type Film, type Person, type Planet, type Species } from "../../types/swapi";
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
    <div>
      <p className="text-gray-300 text-xs tracking-[0.25em] uppercase mb-1">
        {label}
      </p>
      <p className="text-gray-200 text-sm">{value}</p>
    </div>
  );
}

export default function SpeciesDetailPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) return <Navigate to="/species" replace />;

  const { data: species } = useSuspenseQuery<Species>({
    queryKey: ["species-detail", id],
    queryFn: async () => {
      const res = await fetch(`https://swapi.py4e.com/api/species/${id}/`);
      return res.json();
    },
    staleTime: Infinity,
  });

  return (
    <div>
      <title>{species.name} – Star Wars Data Explorer</title>
      <meta name="description" content={`${species.name} — ${species.classification} from ${species.homeworld ?? 'an unknown homeworld'}. Star Wars species profile.`} />
      <Link
        to="/species"
        className="text-[#FFE81F]/80 text-xs tracking-[0.25em] uppercase hover:text-[#FFE81F] mb-8 inline-block"
      >
        ← All Species
      </Link>

      {/* Metadata grid */}
      <section className="border border-[#FFE81F]/20 p-6">
        <h1 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5">
          {species.name}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-5">
          <DetailRow label="Classification" value={species.classification} />
          <DetailRow label="Designation" value={species.designation} />
          <DetailRow label="Average Height" value={species.average_height !== "none" ? `${species.average_height} cm` : "–"} />
          <DetailRow label="Average Lifespan" value={species.average_lifespan !== "indefinite" && species.average_lifespan !== "unknown" ? `${species.average_lifespan} yrs` : species.average_lifespan} />
          <DetailRow label="Language" value={species.language} />
          <DetailRow label="Skin Colors" value={species.skin_colors} />
          <DetailRow label="Hair Colors" value={species.hair_colors} />
          <DetailRow label="Eye Colors" value={species.eye_colors} />
        </div>

        {species.homeworld && (
          <div className="mb-5">
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-3">Homeworld</h2>
            <Suspense fallback={<div className="w-30 h-4 bg-gray-600/20 animate-pulse mb-2"></div>}>
              <SpeciesHomeworld url={species.homeworld} />
            </Suspense>
          </div>
        )}

        <div>
          <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5">Films</h2>
          <Suspense fallback={<ItemsSkeleton count={species.films.length} />}>
            <FilmsList urls={species.films} />
          </Suspense>
        </div>

        {species.people.length > 0 && (
          <div>
            <h2 className="text-[#FFE81F] text-xs font-bold tracking-[0.3em] uppercase mb-5 mt-5">People</h2>
            <Suspense fallback={<ItemsSkeleton count={species.people.length} />}>
              <PeopleList urls={species.people} />
            </Suspense>
          </div>
        )}
      </section>
    </div>
  );
}

const SpeciesHomeworld = ({ url }: { url: string }) => {
  const { data: planet } = useSuspenseQuery<Planet>({
    queryKey: ["planet", url],
    queryFn: async () => {
      const res = await fetch(url);
      return res.json();
    },
  });

  const planetId = url.split('/').at(-2);

  return (
    <Link
      to={`/planets/${planetId}`}
      className="text-gray-200 text-sm hover:text-[#FFE81F]"
    >
      {planet?.name}
    </Link>
  );
};

const FilmsList = ({ urls }: { urls: string[] }) => {
  const results = useLinkedResources<Film>('film', urls);
  return (
    <ul className="flex gap-2">
      {results.map(({ data: film }, i) => {
        const id = urls[i].split('/').at(-2);
        return <li key={urls[i]}>- <Link to={`/films/${id}`}>{film.title}</Link></li>;
      })}
    </ul>
  );
};

const PeopleList = ({ urls }: { urls: string[] }) => {
  const results = useLinkedResources<Person>('person', urls);
  return (
    <ul className="flex gap-2 flex-wrap">
      {results.map(({ data: person }, i) => {
        const id = urls[i].split('/').at(-2);
        return <li key={urls[i]}>- <Link to={`/people/${id}`}>{person.name}</Link></li>;
      })}
    </ul>
  );
};
