import {} from "twin.macro";
import SvgIcon from "./SvgIcon";

export const NavBar = () => {
  return (
    <>
      <div
        tw="top-0 left-0 right-0 h-nav flex flex-row items-center p-2 px-8 mx-2
        bg-gray-900/50
        [background-color: #06242c]
        text-lol-yellow
        text-lg
        sm:text-2xl 
        shadow-2xl
        rounded-b-xl
        shadow-black/50
        outline-1
        outline
        outline-white/5
        [font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif]
        "
      >
        <h1
          tw="capitalize inline-flex gap-4 [min-width: max-content] align-bottom
          drop-shadow-outline-gold
        "
        >
          <SvgIcon name="lol-infernal" height="30" width="30" color="#c28f2c" />
          League tools
        </h1>
      </div>
    </>
  );
};
