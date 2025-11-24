export interface InitialStateInterface {
    projects: any[];
}
export interface ContextAppInterface {
    state: InitialStateInterface;
    dispatch: any;
}