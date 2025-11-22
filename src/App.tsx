import { QueryClientProvider } from "@tanstack/react-query";
import { Champions } from "./pages/Champions/Champions";
import { CreepCalculator } from "./pages/Creep/CreepCalculator";
import { BodyContainer, Container } from "./styles/style";
import { queryClient } from "./utils/utils";
import { ErrorBoundary } from "react-error-boundary";
import { NavBar } from "./components/NavBar";

function App() {
  return (
    <>
      <NavBar />
      <Container>
        <ErrorBoundary fallback={<p>⚠️Oups! Something went wrong...</p>}>
          <QueryClientProvider client={queryClient}>
            <BodyContainer>
              <Champions />
              <CreepCalculator />
            </BodyContainer>
          </QueryClientProvider>
        </ErrorBoundary>
      </Container>
    </>
  );
}

export default App;
