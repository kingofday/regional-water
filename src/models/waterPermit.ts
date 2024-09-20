export enum PermitTypeEnum {
  surfaceWater, //"آب سطحی",
  well, //"چاه"
  pond, //برکه
  spring, //"چشمه"
}
export enum EngineTypeEnum {
  diesel = 0, // دیزل
  electric = 1 // برقی
}
export enum IrrigationNetworkTypeEnum {
  traditional = 0, // سنتی
  modern = 1, // مدرن
  semiModern = 2 // نیمه مدرن
}
export type TSourceLocation = {
  id: string;
  countiesId: number;
  districsId: number;
  citiesId: number;
  ruralDistricsId: number;
  villageId: number;
  plaque: string | null;
  drainageBasin: string | null;
  studyArea: string | null;
};
export type TUserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  fatherName: string;
  birthdate: string;
  nationalCode: string;
  birthCertificateNumber: string;
  certificateCity: string;
  companyName: string | null;
  companyRegistrationNumber: string | null;
  companyNationalCode: string | null;
  address: string;
  postalCode: string | null;
  phoneNumber: string; //"^0\\d{10}$"
  cellPhone: string; //^09[0-9]{2}(-| )?[0-9]{3}(-| )?[0-9]{4}(|-deleted\\d{4})$
};
export type TCropsPercentageViewModel = {
  id: string;
  name: string;
  percentage: number;
};