import { IrrigationNetworkTypeEnum, TCropsPercentageViewModel, TSourceLocation, TUserProfile } from "./waterPermit";

export enum SurfaceWaterUsageVolumeTypeEnum {
  agriculture = 0, // کشاورزی
  drinking = 1, // شرب و بهداشت
  industry = 2, // صنعت
  other = 3 // سایر
}

// WellUsageVolumeTypeEnum with Persian descriptions
export enum WellUsageVolumeTypeEnum {
  agriculture = 0, // کشاورزی
  drinking = 1, // شرب و بهداشت
  industry = 2, // صنعت
  other = 3 // سایر
}

export type TSurfaceWaterUsageVolume = {
  id: string | null;
  surfaceWaterPermitId: string;
  name: string;
  workHours: number;
  cubicMeters: number;
  month: string;
  waterFlow: number;
  surfaceWaterUsageVolumeType: SurfaceWaterUsageVolumeTypeEnum;
};

export type TSurfaceWaterSummary = {
  id: string;
  sourceLocation: TSourceLocation | null;
  sourceLocationId: string | null;
  waterMeasuringInstrumentDeliveredId: string | null;
  waterUserProfile: TUserProfile;
  surfaceWaterUsageVolume: TSurfaceWaterUsageVolume[];
  damTank: number;
  creek: number;
  river: number;
  irrigationAndDrainageNetwork: number;
  mainChannel: number;
  secondChannel: number;
  thirdChannel: number;
  gate: number;
  irrigationNetworkType: IrrigationNetworkTypeEnum;
  altitude: number;
  lat: number;
  long: number;
  deliverPointAltitude: number;
  deliverPointLat: number;
  deliverPointLong: number;
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
};
