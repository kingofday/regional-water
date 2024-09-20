import {
  EngineTypeEnum,
  IrrigationNetworkTypeEnum,
  TCropsPercentageViewModel,
  TSourceLocation,
  TUserProfile,
} from "./waterPermit";

export enum PondRefillTypeEnum {
  gravityEngine = 0, // ثقلی
  pumpingEngine = 1, // پمپاژی
}
export enum PondUsageVolumeTypeEnum {
  agriculture = 0, // کشاورزی
  other = 1, // سایر
}
export enum PondDedicateTypeEnum {
  regulatedFlow = 0,
  naturalFlow = 1,
  combinationOfRegulatedAndNaturalFlow = 2,
}
export type TPondWaterUsageVolume = {
  id: string | null;
  surfaceWaterPermitId: string;
  name: string;
  workHours: number;
  cubicMeters: number;
  month: string;
  waterFlow: number;
  pondUsageVolumeType: PondUsageVolumeTypeEnum;
};

export type TPondWaterSummary = {
  id: string | null;
  engineType: EngineTypeEnum;
  enginePower: number;
  pondRefillType: PondRefillTypeEnum;
  sourceLocation: TSourceLocation | null;
  sourceLocationId: string | null;
  waterMeasuringInstrumentDeliveredId: string | null;
  waterUserProfile: TUserProfile | null;
  pondUsageVolume: TPondWaterUsageVolume[] | null;
  damTank: number;
  creek: number;
  river: number;
  irrigationAndDrainageNetwork: number;
  mainChannel: number;
  secondChannel: number;
  thirdChannel: number;
  gate: number;
  irrigationNetworkType: IrrigationNetworkTypeEnum;
  waterDrain: number;
  aqueduct: number;
  altitude: number;
  lat: number;
  long: number;
  deliverPointAltitude: number;
  deliverPointLat: number;
  deliverPointLong: number;
  area: number;
  depth: number;
  waterIntakeVolume: number;
  fromNorthTo: string;
  fromEastTo: string;
  fromWestTo: string;
  fromSouthTo: string;
  areaOfAgriculturalLands: number;
  cropsUnderCultivationPercentage: TCropsPercentageViewModel[] | null;
  pondDedicateType: PondDedicateTypeEnum;
  nonAgriculturalSeasonFromMonth: number;
  nonAgriculturalSeasonToMonth: number;
  deliverdWaterFlow: number;
  workHours: number;
  deliverdVolume: number;
  deliverdTimeFromMoth: number;
  deliverdTimeToMoth: number;
  measuringInstrumentName: string | null;
};
