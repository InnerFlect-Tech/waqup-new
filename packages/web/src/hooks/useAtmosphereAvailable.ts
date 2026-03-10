import { useQuery } from '@tanstack/react-query';

/**
 * Checks whether atmosphere preset files are available in storage.
 * Used to hide the atmosphere preset selector when no files are uploaded.
 */
export function useAtmosphereAvailable(): { available: boolean; isLoading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: ['atmosphere-available'],
    queryFn: async () => {
      const res = await fetch('/api/audio/atmosphere-available');
      const json = (await res.json()) as { available?: boolean };
      return json.available === true;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
  });

  return { available: data ?? false, isLoading };
}
