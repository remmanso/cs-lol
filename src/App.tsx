import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { NavBar } from "./components/NavBar";
import { Champions } from "./pages/Champions/Champions";
import { CreepCalculator } from "./pages/Creep/CreepCalculator";
import { Container, Layout } from "./styles/style";
import { queryClient } from "./utils/utils";

function App() {
  return (
    <>
      <NavBar />
      <Layout>
        <ErrorBoundary fallback={<p>⚠️Oups! Something went wrong...</p>}>
          <QueryClientProvider client={queryClient}>
            <Container>
              <Champions />
              <CreepCalculator />
            </Container>
          </QueryClientProvider>
        </ErrorBoundary>
      </Layout>
    </>
  );
}

export default App;
