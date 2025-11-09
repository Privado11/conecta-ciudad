import type { InitialStateInterface } from "@/shared/interface/ContextApp";
import { useReducer } from "react";
import type { IProject } from "@/shared/interface/Projects";

export const initialState: InitialStateInterface = {
    projects: [] as IProject[],
}

function reducer(state: InitialStateInterface, action: any) {
    switch (action.type) {
        case "SET_PROJECTS":
            return { ...state, projects: action.payload };
        case "ADD_PROJECT":
            return { ...state, projects: [...state.projects, action.payload] };
        case "UPDATE_PROJECT":
            return { ...state, projects: state.projects.map(project => project.id === action.payload.id ? action.payload : project) };
        case "DELETE_PROJECT":
            return { ...state, projects: state.projects.filter(project => project.id !== action.payload.id) };
        default:
            return state;
    }
}

const useAppReducer = (initialState: InitialStateInterface) => {
    return useReducer(reducer, initialState);
}

export default useAppReducer;