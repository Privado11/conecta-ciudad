export type MenuItem = {
  label: string;
  route: string;
  icon: string;
  highlight?: boolean;
  order?: number;
  children?: MenuItem[];
};

export type UserInfo = {
  username: string;
  fullName: string;
  role: string;
  avatar?: string;
};

export type MenuResponse = {
  user: UserInfo;
  menu: MenuItem[];
};
