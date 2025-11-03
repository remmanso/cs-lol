import { startTransition, useRef, useState } from "react";
import { Slider } from "../components/Slider";
import { useCsCalculator } from "../hooks/useCsCalculator";
import { PRECISION } from "../utils/utils";

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
      <div className="m-auto grid min-w-40 max-w-5xl select-none gap-2 p-2 text-2xl">
        <label>
          {" "}
          Game duration: {minutes.current === 0 ? "0" : minutes.current}m{" "}
          {seconds.current % 60 === 0 ? "" : seconds.current + "s"}
        </label>
        <Slider setValue={setValue} />
        <div className="m-auto flex w-full justify-items-center gap-2 text-xl">
          <label className="mx-auto self-start">
            <b>{totalMinionCount}</b>cs spawned{" "}
            <b className="m-auto ml-2 inline-flex items-end gap-1 self-end text-amber-200">
              {incomeFromMinion}
              <img src="/public/gold-icon.png" />
            </b>
          </label>
          <label className="mx-auto self-start">
            <b>{onLaneCount}</b>cs on lane{" "}
            <b className="m-auto ml-2 inline-flex items-end gap-1 self-end text-amber-200">
              {laneGold}
              <img src="/public/gold-icon.png" />
            </b>
          </label>
          <label className="w-100 m-auto">
            <h2 className="pb-1 text-2xl">
              Max Income Breakdown :<br />
            </h2>
            <li className="ml-10 list-disc">
              <div className="grid grid-cols-2">
                <label>Minions :</label>
                <b className="inline-flex items-end gap-1 self-end justify-self-end text-amber-200">
                  {incomeFromMinion - incomeFromCanon}
                  <img src="/public/gold-icon.png" />
                </b>
              </div>
            </li>
            <li className="ml-10 list-disc">
              <div className="grid grid-cols-2">
                Canon minions :
                <b className="inline-flex items-end gap-1 self-end justify-self-end text-amber-200">
                  {incomeFromCanon}
                  <img src="/public/gold-icon.png" />
                </b>
              </div>
            </li>
            <li className="ml-10 list-disc">
              <div className="grid grid-cols-2">
                Passive Income :
                <b className="inline-flex items-end gap-1 self-end justify-self-end text-amber-200">
                  {passiveIncome}
                  <img src="/public/gold-icon.png" />
                </b>
              </div>
            </li>
            <li className="ml-10 list-disc">
              <div className="grid grid-cols-2">
                Starting Gold :
                <b className="inline-flex items-end gap-1 self-end justify-self-end text-amber-200">
                  {startingGold}
                  <img src="/public/gold-icon.png" />
                </b>
              </div>
            </li>
            <li className="list-none">
              <div className="grid grid-cols-2">
                <b>Total :</b>
                <b className="inline-flex items-end gap-1 self-end justify-self-end text-amber-200">
                  {totalIncome}
                  <img src="/public/gold-icon.png" />
                </b>
              </div>
            </li>
          </label>
        </div>
        {/* <div className="grid grid-cols-2">
          <button className="m-auto columns-1 rounded bg-blue-400 px-3 pb-1 text-base font-bold hover:bg-blue-500 hover:outline-1 hover:outline-gray-900">
            Add
          </button>
          <ul className="columns">
            <li className="ml-10 list-disc">test</li>
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
