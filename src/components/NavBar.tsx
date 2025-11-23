import tw, { css } from "twin.macro";
import SvgIcon from "./SvgIcon";

export const NavBar = () => {
  return (
    <>
      <div
        tw="top-0 left-0 right-0 h-nav flex flex-row items-center p-2 px-8 mx-2
        bg-lol-client-gray
        text-lol-yellow
        text-lg
        sm:text-2xl 
        shadow-2xl
        rounded-b-xl
        outline-1
        outline
        outline-white/5
        [font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif]
        relative
        "
        css={[
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
          `,
          css`
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
        ]}
      >
        <h1
          tw="capitalize inline-flex gap-4 [min-width: max-content] align-bottom 
        [animation: glowing 6s infinite ease-in-out]
        
        "
        >
          <SvgIcon name="lol-infernal" height="30" width="30" color="#c28f2c" />
          League tools
        </h1>
      </div>
    </>
  );
};
