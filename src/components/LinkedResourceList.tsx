import { Link } from 'react-router';
import { useSuspenseQueries } from '@tanstack/react-query';

interface Props<T extends object> {
  urls: string[];
  queryKey: string;
  routePath: string;
  getLabel: (item: T) => string;
}

export function LinkedResourceList<T extends object>({ urls, queryKey, routePath, getLabel }: Props<T>) {
  const results = useSuspenseQueries({
    queries: urls.map((url) => ({
      queryKey: [queryKey, url],
      queryFn: async (): Promise<T> => {
        const res = await fetch(url);
        return res.json();
      },
      staleTime: Infinity,
    })),
  });
  return (
    <ul className="text-gray-200 text-sm space-y-1">
      {results.map(({ data }, i) => {
        const id = urls[i].split('/').at(-2);
        return (
          <li key={urls[i]}>- <Link to={`/${routePath}/${id}`} className="hover:text-[#FFE81F]">{getLabel(data)}</Link></li>
        );
      })}
    </ul>
  );
}
