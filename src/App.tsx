import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppUI from "./AppUI";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppUI />
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
