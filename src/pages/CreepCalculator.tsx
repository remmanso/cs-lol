import { startTransition, useRef, useState } from "react";
import { Slider } from "../components/Slider";
import { useCsCalculator } from "../hooks/useCsCalculator";
import { PRECISION } from "../utils/utils";
import "twin.macro";
import {
  GameDuration,
  GoldIcon,
  IncomeBreakDownContainer,
  IncomeBreakDownItem,
  IncomeBreakDownListItem,
  IncomeBreakDownListItemContainer,
  IncomeBreakDownTitle,
  MinionGoldCount,
  MinionTile,
} from "./style";

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
      <div tw="m-auto grid max-w-5xl select-none gap-2 p-2 text-2xl">
        <GameDuration>
          Game duration: {minutes.current === 0 ? "0" : minutes.current}m
          {seconds.current % 60 === 0 ? "" : seconds.current + "s"}
        </GameDuration>
        <Slider setValue={setValue} />
        <div tw="m-auto flex w-full justify-items-center gap-2 text-xl">
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
          <IncomeBreakDownContainer>
            <IncomeBreakDownTitle>Max Income Breakdown :</IncomeBreakDownTitle>
            <IncomeBreakDownListItem>
              <IncomeBreakDownListItemContainer>
                Minions :
                <IncomeBreakDownItem>
                  {incomeFromMinion - incomeFromCanon}
                  <GoldIcon />
                </IncomeBreakDownItem>
              </IncomeBreakDownListItemContainer>
            </IncomeBreakDownListItem>
            <IncomeBreakDownListItem>
              <IncomeBreakDownListItemContainer>
                Canon minions :
                <IncomeBreakDownItem>
                  {incomeFromCanon}
                  <GoldIcon />
                </IncomeBreakDownItem>
              </IncomeBreakDownListItemContainer>
            </IncomeBreakDownListItem>
            <IncomeBreakDownListItem>
              <IncomeBreakDownListItemContainer>
                Passive gold :
                <IncomeBreakDownItem>
                  {passiveIncome}
                  <GoldIcon />
                </IncomeBreakDownItem>
              </IncomeBreakDownListItemContainer>
            </IncomeBreakDownListItem>
            <IncomeBreakDownListItem>
              <IncomeBreakDownListItemContainer>
                Starting gold :
                <IncomeBreakDownItem>
                  {startingGold}
                  <GoldIcon />
                </IncomeBreakDownItem>
              </IncomeBreakDownListItemContainer>
            </IncomeBreakDownListItem>
            <li tw="list-none">
              <IncomeBreakDownListItemContainer>
                <b>Total :</b>
                <IncomeBreakDownItem>
                  {totalIncome}
                  <GoldIcon />
                </IncomeBreakDownItem>
              </IncomeBreakDownListItemContainer>
            </li>
          </IncomeBreakDownContainer>
        </div>
        {/* <div className="grid grid-cols-2">
          <button className="m-auto columns-1 rounded bg-blue-400 px-3 pb-1 text-base font-bold hover:bg-blue-500 hover:outline-1 hover:outline-gray-900">
            Add
          </button>
          <ul className="columns">
            <IncomeBreakDownListItem>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
            <li>test</li>
          </ul>
        </div> */}
      </div>
    </>
  );
};
