import { Link } from "react-router";

import type { Film } from "../../types/swapi";
import { useQuery } from "@tanstack/react-query";

export default function FilmsPage() {
  const {
    data: films,
    isLoading,
  } = useQuery({
    queryKey: ["films"],
    queryFn: async () => {
      const res = await fetch("https://swapi.py4e.com/api/films/");
      const data = await res.json();
      return data.results as Film[];
    },
  });

  return (
    <>
      <title>Films – Star Wars Data Explorer</title>
      <meta name="description" content="Browse all Star Wars films, from The Phantom Menace to The Force Awakens." />
      <section>
        <h1 className="text-[#FFE81F] text-2xl font-bold tracking-[0.3em] uppercase mb-8">
          Films
        </h1>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {films?.map((film) => (
            <li
              key={film.url}
              className="border relative border-[#FFE81F]/25 p-4 hover:border-[#FFE81F] hover:bg-[#FFE81F]/5 aspect-video "
            >
              <Link
                to={`/films/${film.url.split("/").filter(Boolean).pop()}`}
                className="absolute inset-0 z-10"
              >
                
              </Link>
              <h2 className="text-lg font-semibold text-[#FFE81F] hover:text-white">
                {film.title}
              </h2>
              <p className="text-sm text-gray-400">
                {new Date(film.release_date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-400 line-clamp-3">{film.opening_crawl}</p>
            </li>
          ))}

          
        </ul>
        {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
              <FilmSkeleton />
              <FilmSkeleton />
              <FilmSkeleton />
              <FilmSkeleton />
              <FilmSkeleton />
              <FilmSkeleton />
              <FilmSkeleton />
            </div>
          )}
      </section>
    </>
  );
}

const FilmSkeleton = () => {
  return (
    <div className="animate-pulse border border-[#FFE81F]/25 p-4 aspect-video">
      <div className="h-6 bg-[#FFE81F]/20 mb-2" />
      <div className="h-4 bg-[#FFE81F]/10" />
    </div>
  );
};
