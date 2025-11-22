import { Suspense, useEffect, useState } from "react";
import { useAbilitiesQuery } from "../../hooks/useDDragon";
import { CHAMPION_IMG_URL, ddChampion } from "../../utils/ddTypes";
import tw from "twin.macro";

const spellsName = ["Q", "W", "E", "R"];

export const ChampionAbilities = ({ champ }: { champ: ddChampion }) => {
  const query = useAbilitiesQuery(champ.id);
  const [counter, setCounter] = useState<number[]>([]);

  useEffect(() => {
    setCounter([...Array(query.data.data[champ.id].spells.length)].map(() => 0));
  }, [champ.id, query.data]);

  return (
    <Suspense>
      <div
        tw="grid 
        [grid-template-columns: repeat(auto-fit, minmax(150px, 0.5fr) minmax(150px, 0.5fr))] 
      sm:[grid-template-columns: repeat(auto-fit, minmax(200px, 0.5fr) minmax(200px, 0.5fr))] 
      gap-4 
      md:gap-4 
      place-items-stretch text-sm touch-none [user-select: none] [-webkit-user-drag: none]"
      >
        {query.data.data[champ.id].spells.map((s, spellI) => (
          <div
            key={s.id + champ.id}
            tw="flex flex-col mx-auto items-stretch justify-end 
            [column-gap: 2ch] 
            [min-width: 200px] h-full cursor-pointer w-full ring-1 active:ring-lol-yellow ring-white rounded-lg p-4"
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={(e) => {
              setCounter((prev) => {
                const newCounter = [...prev];
                newCounter[spellI] = Math.max(newCounter[spellI] + (e.button === 2 ? -1 : 1), 0);
                return newCounter;
              });
            }}
          >
            <div tw="flex justify-between items-end gap-4 relative">
              <div tw="relative [flex: 0 0 45px] pt-1">
                <img
                  src={CHAMPION_IMG_URL(s.image.full, champ.version)}
                  tw="rounded-md justify-self-center place-self-end shadow-cm"
                  height={45}
                  width={45}
                  draggable="false"
                  title={s.description}
                />
                <label tw="text-lg absolute left-0.5 bottom-0.5 [line-height: 100%] font-extrabold drop-shadow-outline">
                  {spellI < spellsName.length ? spellsName[spellI] : "more spells ?"}
                </label>
              </div>
              <label tw="text-base font-bold text-end [flex-grow: 1] w-min max-w-fit">{s.name}</label>
              <div tw="flex absolute text-xs -right-2 -top-3 gap-2 font-bold">
                <label tw="text-xs font-bold text-end [flex-grow: 0 1 max-content]">
                  {s.tooltip.includes("<physicalDamage>") ?
                    <span tw="bg-red-500 rounded px-1">Physical</span>
                  : s.tooltip.includes("<magicDamage>") ?
                    <span tw="bg-purple-600 rounded px-1 ">Magical</span>
                  : ""}
                </label>
                {s.tooltip.includes("<trueDamage>") ?
                  <>
                    <span tw="bg-white rounded text-lol-client-bg px-1">True</span>
                  </>
                : ""}
                <span tw="text-lol-yellow">Lvl {(counter[spellI] % s.cooldown.length) + 1}</span>
              </div>
            </div>

            <div tw="mt-2.5 grid grid-rows-2 [grid-template-columns: 5ch repeat(auto-fit, minmax(0,1fr))] [gap: 0.5rem] items-center">
              <span tw="row-start-1 text-xs font-light inline-flex flex-wrap">Cool-Down:</span>
              {s.cooldown.map((c, i, arr) => (
                <div
                  tw="row-start-1 font-semibold shadow-cm rounded text-center ring-1 ring-white  relative text-sm md:text-base"
                  key={s.id + "-" + i}
                  // {(counter[spellI] % arr.length === i ? {"ring-lol-yellow" : "")}
                  css={[counter[spellI] % arr.length === i ? tw`text-lol-yellow ring-1 ring-lol-yellow` : tw``]}
                >
                  {c}
                  {c ?
                    <span tw="[font-size: 10px]">s</span>
                  : ""}
                </div>
              ))}
              <span tw="row-start-2 text-xs font-light">Cost:</span>
              {s.cost.map((c, i, arr) => (
                <div
                  tw="row-start-2 font-semibold shadow-cm rounded text-center ring-1 ring-white text-sm md:text-base"
                  key={s.id + "-" + i}
                  css={[counter[spellI] % arr.length === i ? tw`text-lol-yellow ring-lol-yellow` : tw``]}
                >
                  {c}
                </div>
              ))}
            </div>
            {/* <p>{s.description}</p> */}
          </div>
        ))}
      </div>
    </Suspense>
  );
};
