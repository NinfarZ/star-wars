import { useSuspenseQueries } from '@tanstack/react-query';

export function useLinkedResources<T>(queryKey: string, urls: string[]) {
  return useSuspenseQueries({
    queries: urls.map((url) => ({
      queryKey: [queryKey, url],
      queryFn: async (): Promise<T> => {
        const res = await fetch(url);
        return res.json();
      },
      staleTime: Infinity,
    })),
  });
}
