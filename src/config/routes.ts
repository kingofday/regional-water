enum routes {
  auth = "",
  login = "login",
  splash = "splash",
  panel = "panel",
  profile = "profile",
  dashboard = "dashboard",
  userManagement ="user-management",
  settingManagement="setting-management",
  roleManagement="role-management",
  surfaceWaterLicenseManagement = "surface-water-license-management",
  pondWaterLicenseManagement = "pond-water-license-management",
  springWaterLicenseManagement = "spring-water-license-management",
  
}
export const navigateTo = {
  ...(Object.keys(routes).reduce(
    (acc, k) => ({
      ...acc,
      [k]: `/panel/${routes[k as keyof typeof routes]}`,
    }),
    {}
  ) as { [k in keyof typeof routes]: string }),
  auth: "/",
  login: "/login",
  signup: "/signup",
  splash: "/splash",
  recoverPassword: "/recover-password",
  panel: "/panel",
};
export default routes;
