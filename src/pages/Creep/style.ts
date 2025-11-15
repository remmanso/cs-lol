import tw, { styled } from "twin.macro";

export const ContainerGrid = tw.div`m-auto grid max-w-5xl select-none gap-2 p-2 text-2xl`;
export const ContainerFlex = tw.div`m-auto flex w-full justify-items-center gap-2 text-xl font-bold`;

export const MinionTile = tw.div`mx-auto self-start shrink-0`;
export const GameDuration = tw.div``;

export const MinionGoldCount = tw.div`m-auto ml-2 inline-flex items-end gap-1 self-end text-lol-gold`;

export const GoldIcon = styled.img.attrs({ src: "gold-icon.png", title: "gold" })``;

export const IncomeBreakDown = {
  List: tw.ul`m-auto`,
  Title: tw.h2`pb-1 text-2xl`,
  Value: tw.div`inline-flex items-end gap-1 self-end justify-self-end text-lol-gold`,
  ListContainer: tw.span`grid grid-cols-2`,
  ListItem: tw.li`ml-10 [list-style-type: "- "] [text-indent: 5px]`,
  NoListItem: tw.li`list-none`,
};
