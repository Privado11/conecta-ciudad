import "./App.css";
import { BrowserRouter } from "react-router-dom";
import AppUI from "./AppUI";
import { AuthProvider } from "./context/AuthContext";
import { MenuProvider } from "./context/MenuContext";
import { UserProvider } from "./context/UserContext";
import { ContextApp } from "./shared/provider/store/ContextApp";

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <MenuProvider>
            <UserProvider>
              <ContextApp>
                <AppUI />
              </ContextApp>
            </UserProvider>
          </MenuProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
