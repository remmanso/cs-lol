import { Suspense } from "react";
import { useAbilitiesQuery } from "../../hooks/useDDragon";
import { CHAMPION_IMG_URL, ddChampion } from "../../utils/ddTypes";
import {} from "twin.macro";

const spellsName = ["Q", "W", "E", "R"];

export const ChampionAbilities = ({ champ }: { champ: ddChampion }) => {
  const query = useAbilitiesQuery(champ.id, champ.version);

  return (
    <Suspense>
      <div tw="grid xs:[grid-template-columns: repeat(auto-fit, minmax(25%, 1fr) minmax(25%, 1fr))] sm:grid-cols-4 gap-8 place-content-center text-sm">
        {query.data.data[champ.id].spells.map((s, i) => (
          <div
            key={s.id + champ.id}
            tw="grid sm:[grid-template-columns: 45px 1fr] [grid-template-rows: 45px 1fr] sm:[grid-template-rows: auto] gap-2 sm:justify-evenly"
          >
            <img
              src={CHAMPION_IMG_URL(s.image.full, champ.version)}
              tw="rounded-md justify-self-center place-self-center"
              height={45}
              width={45}
              title={s.description}
            />
            <div tw="grid [grid-template-columns: repeat(auto-fit, auto)]">
              <div tw="grid gap-2 items-center [grid-template-columns: auto 1fr] place-self-stretch justify-items-stretch">
                <label tw="font-bold text-base">{i < spellsName.length ? spellsName[i] : "more spells ?"}</label>
                <label tw="text-xs [text-overflow: clip] text-end [text-size-adjust: ]">{s.name}</label>
              </div>

              <label tw="grid [grid-template-columns: auto 1fr] md:gap-1">
                <b tw="text-xs">Cd(s):</b>
                <div tw="grid gap-0.5 [grid-template-columns: repeat(auto-fit, minmax(2ch, 3ch))] lg:gap-2 text-xs text-end justify-end">
                  {s.cooldown.map((c, i) => (
                    <i key={s.id + "-" + i}>{c + (i < s.cooldown.length - 1 ? "," : "")} </i>
                  ))}
                </div>
              </label>
              <label tw="grid [grid-template-columns: auto 1fr] justify-items-stretch">
                <b tw="text-xs">Cost:</b>
                <div tw="grid gap-0.5 [grid-template-columns: repeat(auto-fit, minmax(2ch, 3ch))] lg:gap-2 text-xs text-end justify-end">
                  {s.cost.map((c, i) => (
                    <i key={s.id + "-" + i}>{c + (i < s.cost.length - 1 ? "," : "")} </i>
                  ))}
                </div>
              </label>
              {/* <p>{s.description}</p> */}
            </div>
          </div>
        ))}
      </div>
    </Suspense>
  );
};
