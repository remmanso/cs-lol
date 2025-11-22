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
    console.log("called");
  }, [champ.id, query.data]);
  console.log(counter);
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
            onPointerDown={() => {
              setCounter((prev) => {
                const newCounter = [...prev];
                newCounter[spellI] = newCounter[spellI] + 1;
                return newCounter;
              });
            }}
          >
            <div tw="flex justify-between items-end gap-4 relative">
              <div tw="relative [flex: 0 0 45px]">
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
              <label tw="text-base [text-overflow: ellipsis] text-end [flex-grow: 1] w-min max-w-fit ">{s.name}</label>
            </div>

            <div tw="mt-2.5 grid grid-rows-2 [grid-template-columns: 5ch repeat(auto-fit, minmax(0,1fr))] [gap: 0.5rem] items-center">
              <span tw="row-start-1 text-xs font-light inline-flex flex-wrap">Cool-down:</span>
              {s.cooldown.map((c, i, arr) => (
                <div
                  tw="row-start-1 font-semibold rounded text-center ring-1 ring-lol-yellow relative text-sm md:text-base"
                  key={s.id + "-" + i}
                  style={counter[spellI] % arr.length === i ? { color: "#c28f2c" } : {}}
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
                  tw="row-start-2 font-semibold shadow-cm rounded text-center ring-1 ring-lol-yellow text-sm md:text-base"
                  key={s.id + "-" + i}
                  style={counter[spellI] % arr.length === i ? { color: "#c28f2c" } : {}}
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
