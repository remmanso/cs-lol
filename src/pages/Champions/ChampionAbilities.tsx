import { Suspense } from "react";
import { useAbilitiesQuery } from "../../hooks/useDDragon";
import { CHAMPION_IMG_URL, ddChampion } from "../../utils/ddTypes";
import {} from "twin.macro";

export const ChampionAbilities = ({ champ }: { champ: ddChampion }) => {
  const query = useAbilitiesQuery(champ.id, champ.version);

  return (
    <Suspense>
      <div tw="grid grid-cols-4 gap-2 place-content-center text-sm">
        {query.data.data[champ.id].spells.map((s) => (
          <div key={s.id + champ.id} tw="grid [grid-template-columns: auto 1fr] gap-2 place-items-center m-auto">
            <img src={CHAMPION_IMG_URL(s.image.full, champ.version)} tw="rounded-md" height={45} width={45} />
            <div tw="grid items-center">
              <div tw="flex gap-2 items-baseline">
                <label tw="font-bold text-base">{s.id.substring(s.id.length - 1)}</label>
                <label tw="text-xs">{s.name}</label>
              </div>
              <label>Cooldown(s): {s.cooldownBurn}</label>
              <label>Cost: {s.costBurn}</label>
              {/* <p>{s.description}</p> */}
            </div>
          </div>
        ))}
      </div>
    </Suspense>
  );
};
