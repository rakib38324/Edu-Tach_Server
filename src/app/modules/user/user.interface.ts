export type TPasswordChange = {
  password: string;
  timestamp: Date;
};

export type TUser = {
  username: string;
  email: string;
  password: TPasswordChange[];
  role: 'user' | 'admin';
};
