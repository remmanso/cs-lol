import { useCallback, useContext, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import tw from "twin.macro";
import SvgIcon from "../../components/SvgIcon";
import { useChampionsQuery } from "../../hooks/useDDragon";
import { Title } from "../../styles/style";
import { ddChampion } from "../../utils/ddTypes";
import { ChampionAbilities } from "./ChampionAbilities";
import { Champion } from "./Champion";
import { ChampionContext } from "./ChampionContext";
import { stringIncludesInsensitive, championImgSrc } from "../../utils/utils";

export const Champions = () => {
  const [championSearched, setChampionSearched] = useState<string>("");
  const [championSelected, setChampionSelected] = useState<ddChampion | null>(null);
  const { champions: championsData, lastVersion } = useChampionsQuery();
  const searchRef = useRef<HTMLInputElement>(null);
  const champions = useMemo(() => {
    const cData = championsData.data?.data;
    if (!cData) return [];
    return Object.keys(cData).map((c) => cData[c]);
  }, [championsData.data?.data]);

  const handleChampion = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setChampionSearched((prev) => e?.target?.value ?? prev);
  }, []);

  const handleEnter = useCallback(() => {
    if (!searchRef?.current?.value) return;

    const searched = champions.filter((c) => stringIncludesInsensitive(c.name, searchRef?.current?.value));

    if (searched.length === 1) {
      setChampionSelected(searched[0]);
      setChampionSearched("");
    }
  }, [champions]);

  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setChampionSearched("");
        event.preventDefault();
      } else if (event.key === "Enter") {
        handleEnter();
        event.preventDefault();
      } else if (
        (!event.altKey && event.ctrlKey && event.key === "k") ||
        (!event.altKey && !event.ctrlKey && event.key === "Tab")
      ) {
        searchRef?.current?.scrollIntoView({ behavior: "smooth" });
        searchRef?.current?.focus();
        searchRef?.current?.select();
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", keyHandler);

    return () => {
      window.removeEventListener("keydown", keyHandler);
    };
  }, [champions, handleEnter]);

  return (
    <ChampionContext
      value={{
        championSearched: championSearched,
        championSelected: championSelected,
        searchRef: searchRef,
        setChampionSelected: setChampionSelected,
      }}
    >
      <div tw="rounded-lg px-8">
        <Title>Champions :</Title>
        <div tw="grid grid-cols-2 gap-4 grid-rows-1 w-full">
          <label tw="row-start-1 col-start-2 justify-self-end">
            Patch version : {lastVersion.data?.[0] ?? "No version"}
          </label>
          <label tw="row-start-1 col-start-1 justify-self-start">Search :</label>
          <div tw="col-span-2 grid grid-cols-1 relative w-full">
            <input
              type="text"
              tw="inline-flex justify-center text-lol-client-bg p-1 font-bold text-base outline-lol-client-bg rounded-md relative px-2 focus:outline-lol-yellow w-full capitalize"
              id="search-champions"
              value={championSearched}
              onChange={handleChampion}
              ref={searchRef}
            />
            <button
              id="reset"
              tw="h-full justify-self-end absolute m-auto mr-2"
              onClick={() => setChampionSearched("")}
            >
              <SvgIcon
                name="close"
                tw="[width: 20px] [height: 20px] text-lol-client-bg/75 can-hover:hover:text-lol-yellow"
              />
            </button>
            {/* <datalist id="champions" tw="w-full">
              {champions.map((o) => (
                <option key={"options-" + o.key} value={o.name}></option>
              ))}
            </datalist> */}
          </div>
          {championSelected && (
            <div tw="col-span-2">
              <div tw="flex flex-row py-4 gap-4 rounded-lg items-end">
                <img
                  tw="[flex: 0 0 60px] [aspect-ratio: 1 / 1]"
                  src={championImgSrc(championSelected.image.full, championSelected.version)}
                  height={40}
                  width={40}
                />
                <Title tw="text-2xl p-0 m-0">{championSelected.name}</Title>
                <span tw="text-sm p-0 m-0 mb-0.5">{championSelected.tags.join(", ")}</span>
              </div>
              <ChampionAbilities champ={championSelected}></ChampionAbilities>
            </div>
          )}

          <div tw="col-span-full grid [grid-template-columns: repeat(auto-fit, minmax(70px, 70px))] justify-center gap-3">
            {champions.map((c) => c && <Champion champion={c} />)}
          </div>
        </div>
      </div>
    </ChampionContext>
  );
};
