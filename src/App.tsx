import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppUI from "./AppUI";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <>
      <BrowserRouter>
      <AuthProvider>
        <AppUI />
      </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
