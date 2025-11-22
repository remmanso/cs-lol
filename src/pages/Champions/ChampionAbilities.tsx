import { Suspense } from "react";
import { useAbilitiesQuery } from "../../hooks/useDDragon";
import { CHAMPION_IMG_URL, ddChampion } from "../../utils/ddTypes";
import {} from "twin.macro";

const spellsName = ["Q", "W", "E", "R"];

export const ChampionAbilities = ({ champ }: { champ: ddChampion }) => {
  const query = useAbilitiesQuery(champ.id);

  return (
    <Suspense>
      <div tw="grid xs:[grid-template-columns: repeat(auto-fit, minmax(200px, 0.5fr) minmax(200px, 0.5fr))] md:grid-cols-4 lg:gap-8 gap-4 place-items-center text-sm">
        {query.data.data[champ.id].spells.map((s, i) => (
          <div key={s.id + champ.id} tw="flex flex-col items-stretch justify-between gap-2 min-w-fit ">
            <div tw="flex items-center gap-2 relative">
              <img
                src={CHAMPION_IMG_URL(s.image.full, champ.version)}
                tw="rounded-md justify-self-center place-self-center shadow-cm"
                height={45}
                width={45}
                title={s.description}
              />
              <label tw="text-base absolute left-0.5 bottom-0.5 [line-height: 100%] font-extrabold drop-shadow-outline">
                {i < spellsName.length ? spellsName[i] : "more spells ?"}
              </label>
              <label tw="text-xs [text-overflow: clip] text-end [text-size-adjust: ] [flex-grow: 1]">{s.name}</label>
            </div>

            <label tw="flex flex-wrap justify-between gap-4">
              <b tw="text-xs">Cd(s):</b>
              <div tw="flex flex-nowrap items-center [width: max-content] gap-2 text-xs text-end justify-end">
                {s.cooldown.map((c, i) => (
                  <i key={s.id + "-" + i}>{c + (i < s.cooldown.length - 1 ? "," : "")} </i>
                ))}
              </div>
            </label>
            <label tw="flex flex-wrap justify-between gap-4">
              <b tw="text-xs">Cost:</b>
              <div tw="flex flex-nowrap items-center [width: max-content] gap-2 text-xs text-end justify-end">
                {s.cost.map((c, i) => (
                  <i key={s.id + "-" + i}>{c + (i < s.cost.length - 1 ? "," : "")} </i>
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
