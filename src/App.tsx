import "./App.css";
import { BrowserRouter } from "react-router-dom";

import { AppProvider } from "./context/AppProvider";
import AppUI from "./AppUI";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppProvider>
          <AppUI />
        </AppProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
