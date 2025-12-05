import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppUI from "./AppUI";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppUI />
      </BrowserRouter>
    </>
  );
}

export default App;
