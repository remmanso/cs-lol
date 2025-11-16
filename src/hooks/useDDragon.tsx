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
      const response = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
      return response.json();
    },
    staleTime: Infinity,
  });

  const championsQuery = useQuery<ddQuery<ddChampion>>({
    queryKey: [ChampionsQueryUID],
    queryFn: () =>
      fetch(
        `https://ddragon.leagueoflegends.com/cdn/${getLastVersion.data?.[0] ?? API_VERSION_FALLBACK}/data/en_US/champion.json`,
      ).then((r) => r.json()),
    enabled: Boolean(getLastVersion.isFetched && getLastVersion.data?.[0]),
  });

  return {
    lastVersion: getLastVersion,
    champions: championsQuery,
  };
};

export const useAbilitiesQuery = (key: string, version: string) => {
  const championAbilitiesQuery = useSuspenseQuery<ddQuery<ddChampionWithSpells>>({
    queryKey: [ChampionAbilitiesUID, key],
    queryFn: () =>
      fetch(
        `https://ddragon.leagueoflegends.com/cdn/${version ?? API_VERSION_FALLBACK}/data/en_US/champion/${key}.json`,
      ).then((r) => r.json()),
  });

  return championAbilitiesQuery;
};
