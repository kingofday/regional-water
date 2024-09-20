export enum ClaimTypes {
  Permission = "Permission",
  FullName = "FullName",
  NationalCode = "NationalCode",
  PhoneNumber = "PhoneNumber",
}
export type TLoginResponse = {
  accessToken: string;
  refreshToken: string;
  claims: {
    type: ClaimTypes;
    value: string;
  }[];
};
