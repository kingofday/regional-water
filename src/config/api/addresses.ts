const addreses = {
  //=== Authenticate
  account: {
    login: "/Account/Login",
  },
  userManager: {
    list: "/userManager/ListUsers",
    add: "/userManager",
    update: "/userManager",
    roles: "/userManager/getRoles",
    find: (id: any) => `/usermanager/find/${id}`,
    changeStatus: (id: number, isEnabled: boolean) =>
      `/userManager/changeStatus?id=${id}&isEnabled=${isEnabled}`,
    delete: (id: number) => `/userManager/${id}`,
  },
  surfacewaterpermit: {
    list: "/surfaceWaterPermit/listSurafceWaterPermits",
    add: "/surfaceWaterPermit/addSurfaceWaterPermit",
    update: "/surfaceWaterPermit/updateSurfaceWaterPermit",
    similar: (data: any) =>
      `/surfaceWaterPermit/getSimilarRecords?${new URLSearchParams(
        data
      ).toString()}`,
    find: (id: any) => `/surfaceWaterPermit/find?id=${id}`,
  },
  springWaterPermit: {
    list: "/springPermit/ListSpringPermits",
    add: "/springPermit/addSpringPermit",
    update: "/springPermit/updateSpringPermit",
    similar: (data: any) =>
      `/springPermit/getSimilarRecords?${new URLSearchParams(
        data
      ).toString()}`,
    find: (id: any) => `/springPermit/find?id=${id}`,
  },
  pondWaterPermit: {
    list: "/pondPermit/ListPondPermits",
    add: "/pondPermit",
    update: "/pondPermit",
    similar: (data: any) =>
      `/pondPermit/getSimilarRecords?${new URLSearchParams(
        data
      ).toString()}`,
    find: (id: any) => `/pondPermit/find?id=${id}`,
  },
  organizationLevel: {
    list: "/OrganizationLevel",
  },
  locations: {
    counties: "/Locations/GetCounties",
    districs: (countyId: string) => `/Locations/counties/${countyId}/districs`,
    cities: (districsId: string) => `/Locations/counties/${districsId}/cities`,
    ruralDistricts: (districsId: string) =>
      `/Locations/districts/${districsId}/rural-districts`,
    villages: (ruralDistrictId: string) =>
      `/Locations/${ruralDistrictId}/villages`,
  },
};
export default addreses;
