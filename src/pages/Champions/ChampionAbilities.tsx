import { Suspense, useEffect, useState } from "react";
import { useAbilitiesQuery } from "../../hooks/useDDragon";
import { CHAMPION_IMG_URL, ddChampion } from "../../utils/ddTypes";
import tw from "twin.macro";

const spellsName = ["Q", "W", "E", "R"];

export const ChampionAbilities = ({ champ }: { champ: ddChampion }) => {
  const query = useAbilitiesQuery(champ.id);
  const [counter, setCounter] = useState<number[]>([]);

  useEffect(() => {
    setCounter([...Array(query.data.data[champ.id].spells.length)].map(() => -1));
    console.log("called");
  }, [champ.id, query.data]);
  console.log(counter);
  return (
    <Suspense>
      <div tw="grid [grid-template-columns: repeat(auto-fit, minmax(150px, 0.5fr) minmax(150px, 0.5fr))] sm:[grid-template-columns: repeat(auto-fit, minmax(200px, 0.5fr) minmax(200px, 0.5fr))] gap-4 md:gap-8 place-items-center text-sm touch-none [user-select: none]">
        {query.data.data[champ.id].spells.map((s, spellI) => (
          <div
            key={s.id + champ.id}
            tw="flex flex-col items-stretch justify-end [column-gap: 2ch] min-w-fit h-full cursor-pointer"
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
                  title={s.description}
                />
                <label tw="text-lg absolute left-0.5 bottom-0.5 [line-height: 100%] font-extrabold drop-shadow-outline">
                  {spellI < spellsName.length ? spellsName[spellI] : "more spells ?"}
                </label>
              </div>
              <label tw="text-base [text-overflow: ellipsis] text-end [flex-grow: 1] w-min max-w-fit ">{s.name}</label>
            </div>

            <label tw="flex flex-wrap justify-between gap-4 items-center">
              <span tw="text-xs font-light">Cd(s):</span>
              <div tw="flex flex-nowrap items-center [width: max-content] gap-1 text-sm text-end justify-end font-semibold">
                {s.cooldown.map((c, i, arr) => (
                  <div
                    key={s.id + "-" + i}
                    style={counter[spellI] > -1 && counter[spellI] % arr.length === i ? { color: "#c28f2c" } : {}}
                  >
                    {c + (i < s.cooldown.length - 1 ? "," : "")}{" "}
                  </div>
                ))}
              </div>
            </label>
            <label tw="flex flex-wrap justify-between gap-4 items-center">
              <b tw="text-xs font-light">Cost:</b>
              <div tw="flex flex-nowrap items-center [width: max-content] gap-1 text-sm text-end justify-end font-semibold">
                {s.cost.map((c, i, arr) => (
                  <div
                    key={s.id + "-" + i}
                    style={counter[spellI] > -1 && counter[spellI] % arr.length === i ? { color: "#c28f2c" } : {}}
                  >
                    {c + (i < s.cost.length - 1 ? "," : "")}{" "}
                  </div>
                ))}
              </div>
            </label>
            {/* <p>{s.description}</p> */}
          </div>
        ))}
      </div>
    </Suspense>
  );
};
