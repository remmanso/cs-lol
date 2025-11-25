import { Suspense, useContext, useEffect, useMemo, useState } from "react";
import { useAbilitiesQuery } from "../../hooks/useDDragon";
import { CHAMPION_IMG_URL, ddChampion } from "../../utils/ddTypes";
import tw from "twin.macro";
import { ChampionContext } from "./ChampionContext";
import { AbilityCooldown } from "./AbilityCooldown";

const spellsName = ["Q", "W", "E", "R"];

export const ChampionAbilities = ({ champ }: { champ: ddChampion }) => {
  const query = useAbilitiesQuery(champ.id);
  const [counter, setCounter] = useState<number[]>([]);
  const abilities = useMemo(() => query.data.data[champ.id], [champ.id, query.data.data]);
  const { cdr } = useContext(ChampionContext);

  useEffect(() => {
    setCounter([...Array(abilities.spells.length)].map(() => -1));
  }, [abilities.spells.length, champ.id, query.data]);

  useEffect(() => {}, [abilities.spells, cdr]);

  return (
    <Suspense>
      <div
        tw="
          flex
          flex-wrap
          gap-4 
          justify-center
          place-items-stretch 
          text-sm 
          [user-select: none] [-webkit-user-drag: none]
        "
      >
        {abilities.spells.map((s, spellIndex) => (
          <div
            key={s.id + champ.id}
            tw="
            relative
            flex-1 [min-width: fit-content] [max-width: 300px]
            p-3 pt-6
            ring-1 ring-white rounded-lg
            cursor-pointer
            can-hover:hover:ring-lol-yellow hover:shadow-cm active:shadow-none
            transition-all 
            [transition-duration: 10ms]
            [transition-timing-function: ease-in-out]
            "
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={(e) => {
              setCounter((prev) => {
                const newCounter = [...prev];
                newCounter[spellIndex] = Math.max(newCounter[spellIndex] + (e.button === 2 ? -1 : 1), -1) % s.maxrank;
                return newCounter;
              });
            }}
          >
            <div tw="inline-flex absolute text-xs right-2 top-1 gap-2 font-bold">
              {s.tooltip.includes("<physicalDamage>") && <span tw="bg-red-500 rounded px-1">Physical</span>}
              {s.tooltip.includes("<magicDamage>") && <span tw="bg-purple-600 rounded px-1 ">Magical</span>}
              {s.tooltip.includes("<trueDamage>") && <span tw="bg-white rounded text-black px-1">True</span>}
              <span tw="text-lol-yellow">Lvl {(counter[spellIndex] % s.cooldown.length) + 1}</span>
            </div>
            <div tw="flex justify-between items-end gap-4">
              <div tw="relative pt-1">
                <img
                  src={CHAMPION_IMG_URL(s.image.full, champ.version)}
                  tw="rounded-md justify-self-center place-self-end shadow-cm"
                  height={45}
                  width={45}
                  draggable="false"
                  title={s.description}
                />
                <span tw="text-lg absolute left-0.5 bottom-0.5 [line-height: 100%] font-extrabold drop-shadow-outline">
                  {spellIndex < spellsName.length ?
                    spellsName[spellIndex]
                  : (console.error(`${champ.id} has more than ${spellsName.length} spells.`) ?? "")}
                </span>
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
                  css={[counter[spellIndex] % arr.length === i ? tw`text-lol-yellow ring-lol-yellow` : tw``]}
                >
                  <AbilityCooldown cooldown={c} />
                </div>
              ))}
              <div tw="row-start-2 text-xs font-light inline-flex flex-wrap">Cost:</div>
              {s.cost.map((c, i, arr) => (
                <div
                  tw="row-start-2 font-semibold shadow-cm rounded text-center ring-1 ring-white text-sm transition-all"
                  key={s.id + "-" + i}
                  css={[counter[spellIndex] % arr.length === i && tw`text-lol-yellow ring-lol-yellow`]}
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
