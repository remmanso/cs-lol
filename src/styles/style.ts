import tw, { css, styled } from "twin.macro";

export const Container = styled.div(() => [
  tw`overflow-auto [height: calc(100vh-50px)] [width: 100vw] relative`,
  css`
    scrollbar-color: #1a1e31 #94a3b8;
    scrollbar-color: #d1d1d1 #2c2c2c;
    scrollbar-width: thin;
  `,
]);

export const BodyContainer = tw.div`flex flex-col max-w-screen-2xl m-auto relative pt-nav`;
