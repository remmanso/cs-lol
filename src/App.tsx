import tw from "twin.macro";
import { CreepCalculator } from "./pages/CreepCalculator";
import "twin.macro";

const Container = tw.div`h-screen w-screen overflow-auto bg-gray-800 font-medium text-white`;

function App() {
  return (
    <Container>
      <CreepCalculator />
    </Container>
  );
}

export default App;
