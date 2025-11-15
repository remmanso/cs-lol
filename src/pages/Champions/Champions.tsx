import { Suspense, useCallback, useMemo, useState, type ChangeEvent } from "react";
import { useChampionsQuery } from "../../hooks/useDDragon";
import tw from "twin.macro";

export const Champions = () => {
  const [championSearched, setChampionSearched] = useState("");

  const { champions: championsData, lastVersion } = useChampionsQuery();

  const champions = useMemo(() => {
    const cData = championsData.data?.data;
    if (!cData) return [];
    return Object.keys(cData).map((c) => cData[c]);
  }, [championsData.data?.data]);

  const handleChampion = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setChampionSearched((prev) => e.target.value ?? prev);
  }, []);

  return (
    <div tw="mt-2 p-4">
      <Suspense fallback={<>Loading...</>}>
        <div tw="grid grid-cols-2 gap-3 grid-rows-1">
          <label tw="row-start-1 col-start-2 justify-self-end">
            Patch version : {lastVersion.data?.[0] ?? "No version"}
          </label>
          <label tw="row-start-1 col-start-1 justify-self-start">Search :</label>
          <div tw="col-span-2 grid grid-cols-1">
            <input
              type="text"
              tw="inline-flex justify-center text-lol-client-bg p-1 font-bold text-base outline-lol-client-bg rounded-md"
              id="search-champions"
              value={championSearched}
              onChange={handleChampion}
            />
          </div>
          <div tw="">
            <h2 tw="font-medium text-xl mb-3">Champions :</h2>
            <ul tw="grid gap-1">
              {champions
                .filter((c) => c.name.toLowerCase().includes(championSearched.toLowerCase()))
                .map(
                  (c) =>
                    c && (
                      <li key={c.id}>
                        {c.name} - {c.tags.join(", ")}
                      </li>
                    ),
                )}
            </ul>
          </div>
        </div>
      </Suspense>
    </div>
  );
};
