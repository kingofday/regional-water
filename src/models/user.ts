export type TRole = {
  id: number;
  name: string;
};
export type TUserSummary = {
  id: number;
  personnelId: number;
  profilePicture: string;
  email: string;
  organizationLevelName: string;
  firstName: string;
  lastName: string;
  baseSalary: number;
  nationalCode: string;
  emailAddress: string;
  isEnabled: boolean;
  phoneNumber: string;
  lastLoggedIn: string;
};