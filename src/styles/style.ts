import tw, { css, styled } from "twin.macro";

export const Layout = styled.div(() => [
  tw`overflow-auto [height: calc(100vh - 50px)] [width: 100vw] pb-nav relative gap-8`,
  css`
    scrollbar-color: #d1d1d1 #0000;
    scrollbar-width: thin;
  `,
]);

export const Container = styled.div(() => [tw`max-w-screen-2xl mx-auto grid gap-8`]);

export const Title = tw.h1`m-3 text-3xl ml-0 text-lol-yellow`;

export const Navbar = styled.div(() => [
  tw`top-0 left-0 right-0 h-nav flex flex-row items-center p-2 px-8 mx-2
        bg-lol-client-gray
        text-lol-yellow
        text-2xl 
        shadow-2xl
        rounded-b-xl
        outline-1
        outline
        outline-white/5
        [font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif]
        relative`,
  css`
    @keyframes glowing {
      0% {
        color: #c28f2c;
        filter: drop-shadow(-1px -1px 1px #0000) drop-shadow(1px -1px 1px #0000) drop-shadow(-1px 1px 1px #0000)
          drop-shadow(1px 1px 1px #0000);
      }
      50% {
        color: #c28f2c;
        filter: drop-shadow(-1px -1px 1px #c2902c33) drop-shadow(1px -1px 1px #c2902c33)
          drop-shadow(-1px 1px 1px #c2902c33) drop-shadow(1px 1px 1px #c2902c33);
      }
      100% {
        color: #c28f2c;
        filter: drop-shadow(-1px -1px 1px #0000) drop-shadow(1px -1px 1px #0000) drop-shadow(-1px 1px 1px #0000)
          drop-shadow(1px 1px 1px #0000);
      }
    }

    @keyframes rotating {
      0% {
        background-position: 0% 0%;
      }
      50% {
        background-position: 100% 100%;
      }
      100% {
        background-position: 200% 200%;
      }
    }

    @keyframes flex-grow {
      0% {
        flex-grow: 0;
      }
      100% {
        flex-grow: 1;
      }
    }

    &::before {
      content: "";
      background: linear-gradient(45deg, #00000000, #c2902c33, #00000000);
      background-size: 200% 200%;
      inset: -2px;
      border-radius: inherit;
      z-index: -1;
      position: absolute;
      filter: blur(7px);
      animation: rotating 6s infinite ease-in-out;
    }
  `,
]);

export const NavBarTitle = styled.div(() => [
  tw`capitalize inline-flex gap-4 [min-width: max-content] align-bottom [animation: glowing 6s infinite ease-in-out]`,
]);
