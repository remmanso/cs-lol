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
    totalMinions: maxCsCount,
    totalGold: maxGold,
    canonMinionGoldTotal: canonValue,
  } = useCsCalculator((sliderValue * GAME_DURATION * 60 * PRECISION) / 100);
  const { totalMinions: onLaneCount, totalGold: laneGold } = useCsCalculator(
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
        <div className="m-auto flex w-full gap-2 text-xl">
          <label className="m-auto">
            {maxCsCount}cs spawned <b className="text-amber-200">({maxGold}g)</b>
          </label>
          <label className="m-auto">
            {onLaneCount}cs on lane <b className="text-amber-200">({laneGold}g)</b>
          </label>
          <label className="m-auto">
            Cumul. gold from canon minions : <b className="text-amber-200">{canonValue}g</b>
          </label>
        </div>
        {/* <div className="grid grid-cols-2">
          <button className="m-auto columns-1 rounded bg-blue-400 px-3 pb-1 text-base font-bold hover:bg-blue-500 hover:outline-1 hover:outline-gray-900">
            Add
          </button>
          <ul className="columns">
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
            <li>test</li>
          </ul>
        </div> */}
      </div>
    </>
  );
};
