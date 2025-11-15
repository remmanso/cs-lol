import { QueryClientProvider } from "@tanstack/react-query";
import { Champions } from "./pages/Champions/Champions";
import { CreepCalculator } from "./pages/Creep/CreepCalculator";
import { Container } from "./styles/style";
import { queryClient } from "./utils/utils";

function App() {
  return (
    <Container>
      <QueryClientProvider client={queryClient}>
        <CreepCalculator />
        <Champions />
      </QueryClientProvider>
    </Container>
  );
}

export default App;
