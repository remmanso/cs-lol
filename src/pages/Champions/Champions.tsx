import { useCallback, useMemo, useState, type ChangeEvent } from "react";
import tw from "twin.macro";
import { useChampionsQuery } from "../../hooks/useDDragon";
import SvgIcon from "../../components/SvgIcon";
import { ddChampion } from "../../utils/ddTypes";
import { ChampionAbilities } from "./ChampionAbilities";
import { Title } from "../../styles/style";

const championImgSrc = (imgPath: string, patch: string) =>
  `https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${imgPath}`;

export const Champions = () => {
  const [championSearched, setChampionSearched] = useState<string>("");
  const [championSelected, setChampionSelected] = useState<ddChampion | null>(null);
  const { champions: championsData, lastVersion } = useChampionsQuery();

  const champions = useMemo(() => {
    const cData = championsData.data?.data;
    if (!cData) return [];
    return Object.keys(cData).map((c) => cData[c]);
  }, [championsData.data?.data]);

  const handleChampion = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setChampionSearched((prev) => e.target.value ?? prev);
  }, []);

  return (
    <div tw="mt-2 rounded-lg p-8">
      <Title>Champions :</Title>
      <div tw="grid grid-cols-2 gap-4 grid-rows-1 w-full">
        <label tw="row-start-1 col-start-2 justify-self-end">
          Patch version : {lastVersion.data?.[0] ?? "No version"}
        </label>
        <label tw="row-start-1 col-start-1 justify-self-start">Search :</label>
        <div tw="col-span-2 grid grid-cols-1 relative w-full">
          <input
            type="text"
            tw="inline-flex justify-center text-lol-client-bg p-1 font-bold text-base outline-lol-client-bg rounded-md relative px-2 focus:accent-lol-yellow w-full"
            id="search-champions"
            value={championSearched}
            onChange={handleChampion}
          />
          <button id="reset" tw="h-full justify-self-end absolute m-auto mr-2" onClick={() => setChampionSearched("")}>
            <SvgIcon name="close" tw="[width: 20px] [height: 20px] text-lol-client-bg/75 hover:text-lol-yellow" />
          </button>
          <datalist id="champions" tw="w-full">
            {champions.map((o) => (
              <option key={"options-" + o.key} value={o.name}></option>
            ))}
          </datalist>
        </div>
        {championSelected ?
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
        : <></>}

        <div tw="col-span-full flex flex-wrap gap-2">
          {/* <ul tw="grid gap-4"> */}
          {champions
            // .filter((c) => c.name.toLowerCase().includes(championSearched.toLowerCase()))
            .map(
              (c) =>
                c && (
                  <div
                    key={c.id}
                    tw="flex items-center rounded-lg p-2 ring-1 ring-white/30 hover:bg-lol-yellow/20 cursor-pointer active:bg-lol-yellow/50 shadow-cm"
                    css={[
                      c.id === championSelected?.id ? tw`bg-lol-yellow/40 ring-lol-yellow` : tw``,
                      !c.name.toLowerCase().includes(championSearched.toLowerCase()) ?
                        tw`opacity-20`
                      : championSearched.toLowerCase() && tw`bg-lol-yellow`,
                    ]}
                    onClick={() => setChampionSelected(c)}
                  >
                    <img tw="[flex: 0 0 40px]" src={championImgSrc(c.image.full, c.version)} height={40} width={40} />
                    {/* <b tw="text-lg">{c.name}</b> */}
                    {/* <i tw="text-xs">({c.title})</i> - {c.tags.join(", ")} */}
                  </div>
                ),
            )}
          {/* </ul> */}
        </div>
      </div>
    </div>
  );
};
