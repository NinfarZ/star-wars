import { Link } from "react-router";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center">
      <title>Star Wars Data Explorer</title>
      <meta name="description" content="Explore the Star Wars universe — films, characters, planets, species, vehicles, and starships from the SWAPI database." />
      <h1 className="text-[#FFE81F] py-16 font-black uppercase text-2xl sm:text-8xl">
        STAR WARS
      </h1>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl mb-16">
        <Link
          to={"/films"}
          className="border border-[#FFE81F]/25 p-6 hover:border-[#FFE81F] hover:bg-[#FFE81F]/5 group"
        >
          <h2 className="text-[#FFE81F] font-bold tracking-[0.2em] uppercase mt-3 mb-2 group-hover:text-white">
            Films
          </h2>
        </Link>

        <Link
          to={"/people"}
          className="border border-[#FFE81F]/25 p-6 hover:border-[#FFE81F] hover:bg-[#FFE81F]/5 group"
        >
          <h2 className="text-[#FFE81F] font-bold tracking-[0.2em] uppercase mt-3 mb-2 group-hover:text-white">
            People
          </h2>
        </Link>

        <Link
          to={"/planets"}
          className="border border-[#FFE81F]/25 p-6 hover:border-[#FFE81F] hover:bg-[#FFE81F]/5 group"
        >
          <h2 className="text-[#FFE81F] font-bold tracking-[0.2em] uppercase mt-3 mb-2 group-hover:text-white">
            Planets
          </h2>
        </Link>
        <Link to={"/species"} className="border border-[#FFE81F]/25 p-6 hover:border-[#FFE81F] hover:bg-[#FFE81F]/5 group">
          <h2 className="text-[#FFE81F] font-bold tracking-[0.2em] uppercase mt-3 mb-2 group-hover:text-white">
            Species
          </h2>
        </Link>
        <Link to={"/vehicles"} className="border border-[#FFE81F]/25 p-6 hover:border-[#FFE81F] hover:bg-[#FFE81F]/5 group">
          <h2 className="text-[#FFE81F] font-bold tracking-[0.2em] uppercase mt-3 mb-2 group-hover:text-white">
            Vehicles
          </h2>
        </Link>
        <Link to={"/starships"} className="border border-[#FFE81F]/25 p-6 hover:border-[#FFE81F] hover:bg-[#FFE81F]/5 group">
          <h2 className="text-[#FFE81F] font-bold tracking-[0.2em] uppercase mt-3 mb-2 group-hover:text-white">
            Starships
          </h2>
        </Link>
      </section>
    </main>
  );
}
