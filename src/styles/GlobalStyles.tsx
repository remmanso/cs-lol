import { createGlobalStyle } from "styled-components";
import tw, { theme, GlobalStyles as BaseStyles } from "twin.macro";

const CustomStyles = createGlobalStyle({
  body: {
    ...tw`antialiased bg-lol-client-gray font-medium text-white p-0 selection:bg-lol-yellow selection:text-lol-client-gray`,
  },
});

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);

export default GlobalStyles;
