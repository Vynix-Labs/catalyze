import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { routes } from "./routes";

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <RouterProvider router={routes} />
    </>
  );
}
export default App;
