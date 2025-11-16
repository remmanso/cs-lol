import { Suspense } from "react";
import { useAbilitiesQuery } from "../../hooks/useDDragon";
import { CHAMPION_IMG_URL, ddChampion } from "../../utils/ddTypes";
import {} from "twin.macro";

export const ChampionAbilities = ({ champ }: { champ: ddChampion }) => {
  const query = useAbilitiesQuery(champ.id, champ.version);

  return (
    <Suspense>
      <div tw="grid grid-cols-4 gap-2 place-content-center">
        {query.data.data[champ.id].spells.map((s) => (
          <div key={s.id + champ.id} tw="grid [grid-template-columns: auto 1fr] gap-2 place-items-center m-auto">
            <img src={CHAMPION_IMG_URL(s.image.full, champ.version)} tw="rounded-md" height={40} width={40} />
            <div tw="grid grid-rows-2 items-center">
              <div tw="">
                {s.id.substring(s.id.length - 1)} <label tw="text-sm">{s.name}</label>
              </div>
              <label>{s.cooldownBurn}</label>
            </div>
          </div>
        ))}
      </div>
    </Suspense>
  );
};
