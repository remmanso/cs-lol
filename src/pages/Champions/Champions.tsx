import { Suspense, useCallback, useMemo, useState, type ChangeEvent } from "react";
import {} from "twin.macro";
import { useChampionsQuery } from "../../hooks/useDDragon";
import SvgIcon from "../../components/SvgIcon";
import { ddChampion } from "../../utils/ddTypes";
import { ChampionAbilities } from "./ChampionAbilities";

const championImgSrc = (imgPath: string, patch: string) =>
  `https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${imgPath}`;

export const Champions = () => {
  const [championSearched, setChampionSearched] = useState<string>("");
  const [championSelected, setChampionSelected] = useState<ddChampion | null>(null);
  // const [championsTags, setChampionsTags] = useState<string[]>();
  const { champions: championsData, lastVersion } = useChampionsQuery();

  const champions = useMemo(() => {
    const cData = championsData.data?.data;
    if (!cData) return [];
    return Object.keys(cData).map((c) => cData[c]);
  }, [championsData.data?.data]);

  const handleChampion = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setChampionSearched((prev) => e.target.value ?? prev);
  }, []);

  // const handleSelect = () => {
  //   if (!championSearched) return;
  //   setChampionsTags((prev) => (!prev ? [championSearched] : [...prev, championSearched]));
  //   setChampionSearched("");
  // };
  return (
    <div tw="mt-2 p-4">
      <Suspense fallback={<>Loading...</>}>
        <h2 tw="font-medium text-xl md:text-2xl mb-3">Champions :</h2>
        <div tw="grid grid-cols-2 gap-3 grid-rows-1">
          <label tw="row-start-1 col-start-2 justify-self-end">
            Patch version : {lastVersion.data?.[0] ?? "No version"}
          </label>
          <label tw="row-start-1 col-start-1 justify-self-start">Search :</label>
          <div tw="col-span-2 grid grid-cols-1 relative">
            <input
              type="text"
              // list="champions"
              tw="inline-flex justify-center text-lol-client-bg p-1 font-bold text-base outline-lol-client-bg rounded-md relative px-2 focus:accent-lol-accent"
              id="search-champions"
              value={championSearched}
              onChange={handleChampion}
              // onSelect={handleSelect}
            />
            {/* <div>
              {championsTags?.map((o) => (
                <span key={"selected-champs-" + o} tw="border-red-700">
                  {o}
                </span>
              ))}
              </div> */}
            <button
              id="reset"
              tw="h-full justify-self-end absolute m-auto mr-2"
              onClick={() => setChampionSearched("")}
            >
              <SvgIcon name="close" tw="[width: 20px] [height: 20px] text-lol-client-bg/75 hover:text-lol-accent" />
            </button>
            <datalist id="champions" tw="w-full">
              {champions.map((o) => (
                <option key={"options-" + o.key} value={o.name}></option>
              ))}
            </datalist>
          </div>
          {championSelected ?
            <div tw="col-span-2">
              <ChampionAbilities champ={championSelected}></ChampionAbilities>
            </div>
          : <></>}

          <div tw="col-span-full">
            <ul tw="grid gap-1">
              {champions
                .filter((c) => c.name.toLowerCase().includes(championSearched.toLowerCase()))
                .map(
                  (c) =>
                    c && (
                      <li key={c.id} tw="border-2 rounded p-2 border-white/30" onClick={() => setChampionSelected(c)}>
                        <div tw="grid [grid-template-columns: auto 1fr] gap-3 items-center">
                          <img tw="" src={championImgSrc(c.image.full, c.version)} height={40} width={40} />
                          <div>
                            <b tw="text-lg">{c.name}</b> <i tw="text-xs">({c.title})</i> - {c.tags.join(", ")}
                          </div>
                          <div tw="col-span-full row-start-2">{c.blurb}</div>
                          {/* <div tw="col-span-2 row-start-3 grid grid-cols-3">
                            {Object.keys(c.stats).map((k) => (
                              <label key={c.key + "-" + k} tw="">
                                {k} : {c.stats?.[k as keyof typeof c.stats]}
                              </label>
                            ))}
                          </div> */}
                        </div>
                      </li>
                    ),
                )}
            </ul>
          </div>
        </div>
      </Suspense>
    </div>
  );
};
