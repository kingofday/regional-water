import type { ItemType } from "antd/es/menu/hooks/useItems";
import { Dispatch, SetStateAction } from "react";
export type TResponse<T> = {
  succeeded: boolean;
  messages: string[];
  result: T;
  exception: number;
};
export type TUser = {
  fullName: string;
  nationalCode: string;
  phoneNumber: string;
};
export enum MenuTypes {
  //[Display(Name = "مدیریت تنظیمات")]
  SettingManager = "SettingManager",
  //[Display(Name = "مدیریت کاربران")]
  UserManager = "UserManager",
  //[Display(Name = "مدیریت نقش‌ها")]
  RoleManager = "RoleManager",
  //[Display(Name = "مدیریت سطح سازمانی")]
  OrganizationLevelManager = "OrganizationLevelManager",
  //[Display(Name = "مدیریت مجوز بهره برداری")]
  WaterPermitManager = "WaterPermitManager",
}
export type TMenu = ItemType & {
  path?: string;
};
export type TTheme = "dark" | "light";
export type TSharedContext = {
  theme: TTheme;
  title: string;
  defaultPath: string;
  user: TUser | null;
  accessToken: string;
  refreshToken?: string;
  menues: MenuTypes[];
  isDrawerOpen: boolean;
  setTitle: (title: string) => void;
  setTheme: (thm: TTheme) => void;
  setMenues: (menues: MenuTypes[]) => void;
  setUser: (user: TUser) => void;
  setToken: (token: string, refreshToken?: string) => void;
  logout: () => void;
  toggleDrawer: (isOpen: boolean) => void;
};
export type PagedData<T> = {
  results: T[];
  page: number;
  pageSize: number;
  totalPagesCount: number;
  totalEntitiesCount: number;
};
export type TooltipItem = {
  value?: string | number | null;
  name?: string;
  color?: string;
  colorForValue?: boolean;
  divider?: boolean;
  redGreenMode?: boolean;
  formatValue?: boolean;
  dir?: "rtl" | "ltr";
  prefix?: string;
  suffix?: string;
};
export type PagedListUpdater<T> = Dispatch<SetStateAction<PagedData<T> | null>>;
export type Updater<T> = Dispatch<SetStateAction<PagedData<T> | T[] | null>>;
export type Dictionary = { [key: string]: string };
export type TLocation = {
  id: number;
  name: string;
};
export enum PersianMonthesEnum {
  farvardin = "0",
  ordibehesht = "1",
  khordad = "2",
  tir = "3",
  mordad = "4",
  shahrivar = "5",
  mehr = "6",
  aban = "7",
  azar = "8",
  dey = "9",
  bahman = "10",
  esfand = "11",
}
export interface ICustomDatePickerProps {
  onChange?: (date: string | null) => void;
  value?: string;
  placeholder?: string;
  popupTargetId?: string;
  disabled?: boolean;
  className?: string;
  hasError?: boolean;
  onRemove?: () => void;
  endTime?: boolean;
  readOnly?: boolean;
}
