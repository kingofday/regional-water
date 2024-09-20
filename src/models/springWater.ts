import {
  TCropsPercentageViewModel,
  TSourceLocation,
  TUserProfile,
} from "./waterPermit";
export enum SpringUsageVolumeTypeEnum {
  agriculture = 0, // کشاورزی
  drinking = 1, // شرب و بهداشت
  industry = 2, // صنعت
  other = 3, // سایر
}
export enum SpringTypeEnum {
  hardBuild = 0,
  alluvium = 1,
}
export type TSpringWaterUsageVolume = {
  id: string | null;
  name: string;
  workHours: number;
  cubicMeters: number;
  month: string;
  waterFlow: number;
  springUsageVolumeType: SpringUsageVolumeTypeEnum;
};
export type TSprintWaterSummary = {
  id: string;
  sourceLocation: TSourceLocation;
  sourceLocationId: string;
  waterMeasuringInstrumentDeliveredId: string;
  waterUserProfile: TUserProfile | null;
  springUsageVolume: TSpringWaterUsageVolume[];
  altitude: number;
  lat: number;
  long: number;
  usingPointAltitude: number;
  usingPointLat: number;
  usingPointLong: number;
  fromNorthTo: string;
  fromEastTo: string;
  fromWestTo: string;
  fromSouthTo: string;
  areaOfAgriculturalLands: number;
  cropsUnderCultivationPercentage: TCropsPercentageViewModel[] | null;
  totalLandArea: number;
  isPumping: boolean;
  isGravityEngine: boolean;
  pumpingEngineType: number;
  diesel: number;
  pumpEnginePower: number;
  measuringInstrumentName: string;
  electroPumpPower: number;
  electric: number;
  springName: string | null;
  springType: SpringTypeEnum;
};
