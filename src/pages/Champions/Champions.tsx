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
    <div tw="mt-2 m-auto rounded-lg p-8">
      <Title>Champions :</Title>
      <div tw="grid grid-cols-2 gap-4 grid-rows-1">
        <label tw="row-start-1 col-start-2 justify-self-end">
          Patch version : {lastVersion.data?.[0] ?? "No version"}
        </label>
        <label tw="row-start-1 col-start-1 justify-self-start">Search :</label>
        <div tw="col-span-2 grid grid-cols-1 relative">
          <input
            type="text"
            tw="inline-flex justify-center text-lol-client-bg p-1 font-bold text-base outline-lol-client-bg rounded-md relative px-2 focus:accent-lol-yellow"
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
            <ChampionAbilities champ={championSelected}></ChampionAbilities>
          </div>
        : <></>}

        <div tw="col-span-full">
          <ul tw="grid gap-4">
            {champions
              .filter((c) => c.name.toLowerCase().includes(championSearched.toLowerCase()))
              .map(
                (c) =>
                  c && (
                    <li
                      key={c.id}
                      tw="border rounded-lg p-4 ring-1 ring-white/30 hover:bg-lol-yellow/20 cursor-pointer active:bg-lol-yellow/50 shadow-cm"
                      css={[c.id === championSelected?.id && tw`bg-lol-yellow/40 ring-lol-yellow`]}
                      onClick={() => setChampionSelected(c)}
                    >
                      <div tw="grid [grid-template-columns: auto 1fr] gap-3 items-center">
                        <img tw="" src={championImgSrc(c.image.full, c.version)} height={40} width={40} />
                        <div>
                          <b tw="text-lg">{c.name}</b> <i tw="text-xs">({c.title})</i> - {c.tags.join(", ")}
                        </div>
                        <div tw="col-span-full row-start-2">{c.blurb}</div>
                      </div>
                    </li>
                  ),
              )}
          </ul>
        </div>
      </div>
    </div>
  );
};
