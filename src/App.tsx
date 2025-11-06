import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppUI from "./AppUI";
import { AuthProvider } from "./context/AuthContext";
import { MenuProvider } from "./context/MenuContext";

function App() {
  return (
    <>
      <BrowserRouter>
      <AuthProvider>  
        <MenuProvider>
          <AppUI />
        </MenuProvider>
      </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
