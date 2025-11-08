import tw, { styled } from "twin.macro";

export const MinionTile = tw.div`mx-auto self-start shrink-0`;
export const GameDuration = tw.div``;

export const MinionGoldCount = tw.div`m-auto ml-2 inline-flex items-end gap-1 self-end text-lol-gold`;
export const GoldIcon = styled.img.attrs({ src: "gold-icon.png" })``;

export const IncomeBreakDownContainer = tw.div`m-auto`;
export const IncomeBreakDownTitle = tw.h2`pb-1 text-2xl`;

export const IncomeBreakDownItem = tw.li`inline-flex items-end gap-1 self-end justify-self-end text-lol-gold`;
export const IncomeBreakDownListItem = tw.li`ml-10 list-disc`;
export const IncomeBreakDownListItemContainer = tw.div`grid grid-cols-2`;
