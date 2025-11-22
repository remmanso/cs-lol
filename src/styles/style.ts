import tw, { css, styled } from "twin.macro";

export const Container = styled.div(() => [
  tw`overflow-auto [height: calc(100vh-50px)] [width: 100vw] relative pb-nav`,
  css`
    scrollbar-color: #1a1e31 #94a3b8;
    scrollbar-color: #d1d1d1 #2c2c2c;
    scrollbar-width: thin;
  `,
]);

export const BodyContainer = tw.div`flex flex-col max-w-screen-2xl mx-auto relative gap-8`;

export const Title = tw.h1`m-3 text-3xl ml-0 text-lol-yellow`;
