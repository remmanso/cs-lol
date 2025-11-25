import { createContext, RefObject } from "react";
import { ddChampion } from "../../utils/ddTypes";

export const ChampionContext = createContext<{
  championSearched: string | null;
  championSelected: ddChampion | null;
  searchRef?: RefObject<HTMLInputElement | null>;
  setChampionSelected: (champion: ddChampion) => void;
  cdr: number;
}>({
  championSelected: null,
  championSearched: null,
  searchRef: { current: null },
  setChampionSelected: () => {},
  cdr: 100,
});
