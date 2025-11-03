import {
  CANON_MINION_UPGRADE_TIME_MS,
  PASSIVE_GOLD_RATE_MS,
  STARTING_GOLD_AMOUNT,
  timeToMs,
  WAVE_GOLD_VALUE,
  WAVE_SPAWN_FREQUENCY_MS,
} from "../utils/utils";

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
    let minionsCount = 0;
    let minionsGold = 0; // start with 500 on SR
    let canonMinionGoldTotal = 0;
    let canonValue = 0;
    while (currentTimeMs <= elapsedTimeMs) {
      currentTimeMs += WAVE_SPAWN_FREQUENCY_MS;
      minionsCount += 6;
      minionsGold += WAVE_GOLD_VALUE;
      if (currentTimeMs - lastCanonTime >= canonFrequency) {
        minionsCount++;
        lastCanonTime = currentTimeMs;

        canonValue = calculate_canon_value(currentTimeMs);
        canonMinionGoldTotal += canonValue;
        minionsGold += canonValue;
      }

      if (nextStage && currentTimeMs >= nextStage.startTime) {
        canonFrequency = nextStage.canonFrequency;
        currentStage++;
        nextStage = getNextSpawnTime();
      }
    }
    const passiveIncome = Math.round(Math.max((elapsedTimeMs - timeToMs(0, 1, 40)) * PASSIVE_GOLD_RATE_MS, 0));
    return {
      minionsCount,
      minionsGold,
      canonMinionGoldTotal,
      passiveIncome,
      startingGold: STARTING_GOLD_AMOUNT,
      totalIncome: STARTING_GOLD_AMOUNT + minionsGold + passiveIncome,
    };
  };

  return calculateCs(elapsedTimeMs);
};
