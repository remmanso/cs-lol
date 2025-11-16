import { useQuery } from "@tanstack/react-query";
import { LastApiVersionQueryUID, ChampionsQueryUID, API_VERSION_FALLBACK } from "../utils/constants";

type ddChampion = {
  version: string;
  id: string; //name
  key: string; //id
  name: string; //name
  title: string;
  blurb: string;
  info: {
    attack: number;
    defense: number;
    magic: number;
    difficulty: number;
  };
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  tags: string[];
  parttype: string;
  stats: {
    hp: number;
    hpperlevel: number;
    mp: number;
    mpperlevel: number;
    movespeed: number;
    armor: number;
    armorperlevel: number;
    spellblock: number;
    spellblockperlevel: number;
    attackrange: number;
    hpregen: number;
    hpregenperlevel: number;
    mpregen: number;
    mpregenperlevel: number;
    crit: number;
    critperlevel: number;
    attackdamage: number;
    attackdamageperlevel: number;
    attackspeedperlevel: number;
    attackspeed: number;
  };
};

type ddChampionsQuery = {
  type: string;
  version: string;
  data: Record<string, ddChampion>;
};

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

  const championsQuery = useQuery<ddChampionsQuery>({
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

// export const useAbilitiesQuery = (key: string, version: string) => {
//   const championAbilitiesQuery = useSuspenseQuery<ddChampionsQuery>({
//     queryKey: [ChampionsQueryUID],
//     queryFn: () =>
//       fetch(
//         `https://ddragon.leagueoflegends.com/cdn/${version ?? API_VERSION_FALLBACK}/data/en_US/champion/${key}.json`,
//       ).then((r) => r.json()),
//   });
//   return {
//     lastVersion: getLastVersion,
//     champions: championsQuery,
//   };
// };
