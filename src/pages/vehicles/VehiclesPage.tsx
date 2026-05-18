import { Suspense, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { type Vehicle, type SwapiList } from '../../types/swapi';
import Pagination from '../../components/Pagination';
import { Link } from 'react-router';

function VehicleCardSkeleton() {
  return (
    <div className="border border-[#FFE81F]/20 p-4 animate-pulse">
      <div className="h-4 bg-[#FFE81F]/10 rounded w-2/3 mb-3" />
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex justify-between gap-4">
            <div className="h-3 bg-gray-700/40 rounded w-1/4" />
            <div className="h-3 bg-gray-700/40 rounded w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

function VehiclesPageSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const vehicleId = vehicle.url.split('/').at(-2);

  return (
    <div className="border relative border-[#FFE81F]/20 p-4 hover:border-[#FFE81F]/50">
      <Link to={`/vehicles/${vehicleId}`} className="absolute inset-0 z-10" />
      <h2 className="text-[#FFE81F] font-bold tracking-wide mb-3">{vehicle.name}</h2>
      <dl className="text-sm space-y-1">
        {[
          ['Model', vehicle.model],
          ['Class', vehicle.vehicle_class],
          ['Crew', vehicle.crew],
          ['Passengers', vehicle.passengers],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="text-gray-300 capitalize shrink-0">{label}</dt>
            <dd className="text-gray-300 capitalize text-right">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 pt-3 border-t border-[#FFE81F]/10 text-xs text-gray-300">
        {vehicle.films.length} film{vehicle.films.length !== 1 ? 's' : ''}
      </p>
    </div>
  );
}

interface VehiclesListProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

function VehiclesList({ page, setPage }: VehiclesListProps) {
  const { data } = useSuspenseQuery<SwapiList<Vehicle>>({
    queryKey: ['vehicles', page],
    queryFn: async () => {
      const res = await fetch(`https://swapi.py4e.com/api/vehicles/?page=${page}`);
      return res.json();
    },
  });

  const totalPages = Math.ceil(data.count / 10);

  return (
    <>
      <p className="text-gray-300 text-xs mb-5">
        {data.count} vehicle{data.count !== 1 ? 's' : ''} in the database
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.results.map((vehicle) => (
          <VehicleCard key={vehicle.url} vehicle={vehicle} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />
      )}
    </>
  );
}

export default function VehiclesPage() {
  const [page, setPage] = useState(1);

  return (
    <div>
      <title>Vehicles – Star Wars Data Explorer</title>
      <meta name="description" content="Browse all ground and air vehicles from the Star Wars universe." />
      <h1 className="text-[#FFE81F] text-2xl font-bold tracking-[0.3em] uppercase mb-6">
        Vehicles
      </h1>
      <Suspense fallback={<VehiclesPageSkeleton />}>
        <VehiclesList page={page} setPage={setPage} />
      </Suspense>
    </div>
  );
}
