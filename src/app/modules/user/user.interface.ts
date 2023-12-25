export type TPassword = {
  password: string;
  timestamp: string;
};
export type TpreviousPassword_1 = {
  previousPassword_1: string;
  timestamp: string;
};
export type TpreviousPassword_2 = {
  previousPassword_1: string;
  timestamp: string;
};

export type TUser = {
  username: string;
  email: string;
  password: TPassword;
  previousPassword_1: TpreviousPassword_1;
  previousPassword_2: TpreviousPassword_2;
  role: 'user' | 'admin';
};
