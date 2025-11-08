import { startTransition, useRef, useState } from "react";
import "twin.macro";
import { Slider } from "../components/Slider";
import { useCsCalculator } from "../hooks/useCsCalculator";
import { PRECISION } from "../utils/utils";
import {
  ContainerFlex,
  ContainerGrid,
  GameDuration,
  GoldIcon,
  IncomeBreakDown,
  MinionGoldCount,
  MinionTile,
} from "./style";
import { ListItem } from "../components/ListItem";

const GAME_DURATION = 60;
export const CreepCalculator = () => {
  const [sliderValue, setSliderValue] = useState(0);

  const minutes = useRef(0);
  const seconds = useRef(0);

  const {
    minionsCount: totalMinionCount,
    minionsGold: incomeFromMinion,
    canonMinionGoldTotal: incomeFromCanon,
    passiveIncome,
    startingGold,
    totalIncome,
  } = useCsCalculator((sliderValue * GAME_DURATION * 60 * PRECISION) / 100);
  const { minionsCount: onLaneCount, minionsGold: laneGold } = useCsCalculator(
    (sliderValue * GAME_DURATION * 60 * PRECISION) / 100 - 30 * PRECISION,
  );

  const setValue = (num: number) => {
    requestAnimationFrame(() => {
      startTransition(() => {
        setSliderValue(num);
      });
    });
  };

  seconds.current = Math.round((((sliderValue * GAME_DURATION) / 100) % 1) * 60) % 60;
  minutes.current = Math.floor((sliderValue * GAME_DURATION) / 100);

  return (
    <>
      <ContainerGrid>
        <GameDuration>
          Game duration: {minutes.current === 0 ? "0" : minutes.current}m
          {seconds.current % 60 === 0 ? "" : seconds.current + "s"}
        </GameDuration>

        <Slider setValue={setValue} />

        <ContainerFlex>
          <MinionTile>
            <b>{totalMinionCount}</b>cs spawned
            <MinionGoldCount>
              {incomeFromMinion}
              <GoldIcon />
            </MinionGoldCount>
          </MinionTile>

          <MinionTile>
            <b>{onLaneCount}</b>cs on lane
            <MinionGoldCount>
              {laneGold}
              <GoldIcon />
            </MinionGoldCount>
          </MinionTile>

          <IncomeBreakDown.List>
            <IncomeBreakDown.Title>Max Income Breakdown :</IncomeBreakDown.Title>
            <ListItem title="Minions" value={incomeFromMinion - incomeFromCanon} />
            <ListItem title="Canon minions" value={incomeFromCanon} />
            <ListItem title="Passive gold" value={passiveIncome} />
            <ListItem title="Starting gold" value={startingGold} />
            <ListItem title="Total" value={totalIncome} isTotal />
          </IncomeBreakDown.List>
        </ContainerFlex>
      </ContainerGrid>
    </>
  );
};
