import { timeToMs} from "../utils/utils";

type CanonWaveFrequency = {
  startTime: number;
  canonFrequency: number;
  offset?: number;
};

const WAVE_SPAWN_FREQUENCY_MS = 30 * 1000;
const CANON_MINION_UPGRADE_TIME_MS: CanonWaveFrequency[] = [
  { startTime: timeToMs(0, 1, 5), canonFrequency: timeToMs(0, 1, 30), offset: 30 },
  { startTime: timeToMs(0, 15, 0), canonFrequency: timeToMs(0, 1, 0) },
  { startTime: timeToMs(0, 25, 0), canonFrequency: timeToMs(0, 0, 30) },
];
const WAVE_GOLD_VALUE = 21*3+14*3;

const calculate_canon_value = (elapsedTimeMs: number) =>
  60 +
  3 * Math.floor(Math.max(Math.min(elapsedTimeMs, timeToMs(0, 17, 15)) - timeToMs(0, 2, 15), 0) / timeToMs(0, 1, 30));

export const useCsCalculator = (elapsedTimeMs: number) => {
  const calculateCs = (elapsedTimeMs: number) => {
    let currentStage = 0;
    const getNextSpawnTime = () =>
      currentStage > CANON_MINION_UPGRADE_TIME_MS.length - 2 ? null : CANON_MINION_UPGRADE_TIME_MS[currentStage + 1];
    // const numberOfWaves = Math.floor((time - spawnTime) / WAVE_SPAWN_FREQUENCY_MS) + 1;
    let { startTime: currentTimeMs, canonFrequency, offset } = CANON_MINION_UPGRADE_TIME_MS[0];
    let lastCanonTime = currentTimeMs + (offset ?? 0) * 1000; // we offset the first wave,
    let nextStage = getNextSpawnTime();
    let totalMinions = 0;
    let totalGold = 0;
    let canonMinionGoldTotal = 0;
    let canonValue = 0;
    while (currentTimeMs <= elapsedTimeMs) {
      currentTimeMs += WAVE_SPAWN_FREQUENCY_MS;
      totalMinions += 6;
      totalGold += WAVE_GOLD_VALUE;
      if (currentTimeMs - lastCanonTime >= canonFrequency) {
        totalMinions++;
        lastCanonTime = currentTimeMs;

        canonValue = calculate_canon_value(currentTimeMs);
        canonMinionGoldTotal += canonValue;
        totalGold += canonValue;
      }

      if (nextStage && currentTimeMs >= nextStage.startTime) {
        canonFrequency = nextStage.canonFrequency;
        currentStage++;
        nextStage = getNextSpawnTime();
      }
    }
    return { totalMinions, totalGold, canonMinionGoldTotal };
  };

  return calculateCs(elapsedTimeMs);
};
