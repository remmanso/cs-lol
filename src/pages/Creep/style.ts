import tw, { styled } from "twin.macro";

export const ContainerGrid = tw.div`m-auto grid max-w-5xl select-none gap-2 p-4 md:text-2xl text-xl`;
export const Container = tw.div`m-auto grid [grid-template-rows: auto 1fr] md:[grid-template-columns: repeat(3, auto)] w-full md:justify-items-center gap-x-6 gap-y-2 md:text-xl text-base font-semibold `;

export const MinionTile = tw.div`grid [grid-template-columns: auto 1fr] row-span-1 w-full`;
export const GameDuration = tw.div``;

export const MinionGoldCount = tw.div`ml-2 flex gap-1 justify-self-end text-lol-gold`;

export const GoldIcon = styled.img.attrs({ src: "gold-icon.png", title: "gold" })(() => [
  tw`[height: 11px] [width: 11px] md:[height: 13px] md:[width: 13px] self-end mb-1`,
]);

export const IncomeBreakDown = {
  List: tw.ul`row-span-2`,
  Title: tw.h2`pb-1 md:text-xl`,
  Value: tw.div`inline-flex gap-1 text-lol-gold justify-self-end ml-4`,
  ListContainer: tw.span`grid [grid-template-columns: auto 1fr]`,
  ListItem: tw.li`pl-2 md:pl-4 border-b-2 border-white/10 pb-0.5 `,
  NoListItem: tw.li`list-none w-full`,
};
