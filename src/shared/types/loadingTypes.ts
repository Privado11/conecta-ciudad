export type LoadingUserState = {
  fetching: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  togglingActive: boolean;
  addingRole: boolean;
  removingRole: boolean;
  fetchingCurators: boolean;
  assigningCurator: boolean;
};

export type LoadingAuditState = {
  fetching: boolean;
  fetchingStatistics: boolean;
  fetchingDetails: boolean;
};

