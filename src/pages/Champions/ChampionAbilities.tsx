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
        tw="
          flex
          flex-wrap
          gap-4 
          justify-around
          place-items-stretch 
          text-sm 
          touch-none [user-select: none] [-webkit-user-drag: none]
        "
      >
        {query.data.data[champ.id].spells.map((s, spellI) => (
          <div
            key={s.id + champ.id}
            tw="flex flex-col items-stretch justify-between 
            [column-gap: 2ch] 
            relative
            p-4 py-6
            [flex: 1 1 0]
            [min-width: max-content]
            [max-width: 400px]
            ring-1 hover:ring-lol-yellow hover:shadow-cm active:shadow-none ring-white rounded-lg
            transition-all 
            cursor-pointer
            "
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={(e) => {
              setCounter((prev) => {
                const newCounter = [...prev];
                newCounter[spellI] = Math.max(newCounter[spellI] + (e.button === 2 ? -1 : 1), 0);
                return newCounter;
              });
            }}
          >
            <div tw="flex absolute text-xs right-2 top-1 gap-2 font-bold">
              {s.tooltip.includes("<physicalDamage>") && <span tw=" bg-red-500 rounded px-1">Physical</span>}
              {s.tooltip.includes("<magicDamage>") && <span tw=" bg-purple-600 rounded px-1 ">Magical</span>}
              {s.tooltip.includes("<trueDamage>") && <span tw=" bg-white rounded text-black px-1">True</span>}
              <span tw="text-lol-yellow">Lvl {(counter[spellI] % s.cooldown.length) + 1}</span>
            </div>
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
            </div>
            <div tw="mt-2.5 grid grid-rows-2 grid-cols-[repeat(auto-fit, minmax(0, 1fr))] [gap: 0.5rem] items-center ">
              <div tw="row-start-1 text-xs font-light inline-flex flex-wrap">Cool-Down:</div>
              {s.cooldown.map((c, i, arr) => (
                <div
                  tw="row-start-1 font-semibold shadow-cm rounded ring-1 ring-white text-sm text-center  min-w-max transition-all
                  "
                  key={s.id + "-" + i}
                  css={[counter[spellI] % arr.length === i ? tw`text-lol-yellow ring-lol-yellow` : tw``]}
                >
                  {c}
                  {c && <span tw="[font-size: 10px]">s</span>}
                </div>
              ))}
              <div tw="row-start-2 text-xs font-light inline-flex flex-wrap">Cost:</div>
              {s.cost.map((c, i, arr) => (
                <div
                  tw="row-start-2 font-semibold shadow-cm rounded text-center ring-1 ring-white text-sm transition-all"
                  key={s.id + "-" + i}
                  css={[counter[spellI] % arr.length === i ? tw`text-lol-yellow ring-lol-yellow` : tw``]}
                >
                  {c}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Suspense>
  );
};
