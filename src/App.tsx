import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppUI from "./AppUI";
import { AppProvider } from "./context/AppProvider";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppUI />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
