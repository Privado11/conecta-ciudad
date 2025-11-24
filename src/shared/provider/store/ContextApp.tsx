import { createContext } from "react";
import useAppReducer, { initialState } from "./useAppReducer";
import type { ContextAppInterface } from "@/shared/interface/ContextApp";

export const contextApp = createContext<ContextAppInterface>({
    state: initialState,
    dispatch: () => {}
});

export function ContextApp({children}: {children: React.ReactNode}) {
    const [state, dispatch] = useAppReducer(initialState);
    return (
        <contextApp.Provider value={{state, dispatch}}>
            {children}
        </contextApp.Provider>
    );
}