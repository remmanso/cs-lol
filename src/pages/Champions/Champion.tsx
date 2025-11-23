import { useContext } from "react";
import tw from "twin.macro";
import { ddChampion } from "../../utils/ddTypes";
import { championImgSrc, stringIncludesInsensitive } from "../../utils/utils";
import { ChampionContext } from "./ChampionContext";

export const Champion = ({ champion }: { champion: ddChampion }) => {
  const championContext = useContext(ChampionContext);

  return (
    <div
      key={champion.id}
      tw="
        flex 
        items-center justify-center 
        rounded-lg 
        p-2 
        ring-1 ring-white/30 
        hover:bg-lol-yellow/20 
        active:bg-lol-yellow/50
        active:shadow-none
        shadow-cm 
        transition-all 
        cursor-pointer 
      "
      css={[
        champion.id === championContext.championSelected?.id ? tw`bg-lol-yellow/40 ring-lol-yellow` : tw``,
        !stringIncludesInsensitive(champion.name, championContext?.championSearched ?? "") ?
          tw`opacity-20`
        : championContext?.championSearched && tw`bg-lol-yellow`,
      ]}
      onClick={() => {
        championContext.setChampionSelected(champion);
        championContext?.searchRef?.current?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <img src={championImgSrc(champion.image.full, champion.version)} height={100} width={100} title={champion.name} />
    </div>
  );
};
