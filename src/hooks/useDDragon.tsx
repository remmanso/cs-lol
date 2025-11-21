import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  LastApiVersionQueryUID,
  ChampionsQueryUID,
  API_VERSION_FALLBACK,
  ChampionAbilitiesUID,
} from "../utils/constants";
import { ddQuery, ddChampion, ddChampionWithSpells } from "../utils/ddTypes";

// const errorLog = () => console.error("unable to get last api version, defaults to 15.22.1");
export const useChampionsQuery = () => {
  const getLastVersion = useQuery<string[]>({
    queryKey: [LastApiVersionQueryUID],
    queryFn: async () => {
      const response = await fetch("/data/version.json");
      return response.json();
    },
    staleTime: Infinity,
  });

  const championsQuery = useQuery<ddQuery<ddChampion>>({
    queryKey: [ChampionsQueryUID],
    queryFn: () => fetch(`/data/champions.json`).then((r) => r.json()),
    enabled: Boolean(getLastVersion.isFetched && getLastVersion.data?.[0]),
  });

  return {
    lastVersion: getLastVersion,
    champions: championsQuery,
  };
};

export const useAbilitiesQuery = (key: string) => {
  const championAbilitiesQuery = useSuspenseQuery<ddQuery<ddChampionWithSpells>>({
    queryKey: [ChampionAbilitiesUID, key],
    queryFn: () => fetch(`/data/champions/${key}/abilities.json`).then((r) => r.json()),
  });

  return championAbilitiesQuery;
};
