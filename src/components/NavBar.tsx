import { Navbar, NavBarTitle } from "../styles/style";
import SvgIcon from "./SvgIcon";

export const NavBar = () => (
  <Navbar>
    <NavBarTitle>
      <SvgIcon name="lol-infernal" height="30" width="30" color="#c28f2c" />
      League tools
    </NavBarTitle>
  </Navbar>
);
