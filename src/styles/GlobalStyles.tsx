import { createGlobalStyle } from "styled-components";
import tw, { theme, GlobalStyles as BaseStyles, css } from "twin.macro";

const CustomStyles = createGlobalStyle({
  body: {
    ...tw`antialiased bg-lol-client-gray font-medium text-white p-0 selection:bg-lol-yellow selection:text-lol-client-gray`,
    ...css`
      transition-behavior: allow-discrete;
    `,
  },
});

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <CustomStyles />
  </>
);

export default GlobalStyles;
