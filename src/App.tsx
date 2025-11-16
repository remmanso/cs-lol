import { QueryClientProvider } from "@tanstack/react-query";
import { Champions } from "./pages/Champions/Champions";
import { CreepCalculator } from "./pages/Creep/CreepCalculator";
import { Container } from "./styles/style";
import { queryClient } from "./utils/utils";
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <Container>
      <ErrorBoundary fallback={<p>⚠️Oups! Something went wrong...</p>}>
        <QueryClientProvider client={queryClient}>
          <CreepCalculator />
          <Champions />
        </QueryClientProvider>
      </ErrorBoundary>
    </Container>
  );
}

export default App;
