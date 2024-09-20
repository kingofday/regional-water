import { ConfigProvider } from "antd";
import faIR from "antd/lib/locale/fa_IR";
import "assets/styles/index.scss";
import colors from "config/colors";
import routes from "config/routes";
import {
  lazy,
  Suspense,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { Navigate, Route, Routes } from "react-router";
import utils from "config/utils";
import SharedContext from "context/SharedContext";
import { MenuTypes, TSharedContext, TTheme, TUser } from "models";
import ErrorBoundry from "./shared/ErrorBoundry";
import useCache from "hooks/useCache";
//const Profile = lazy(() => import("./panel/profile"));
const Splash = lazy(() => import("./Splash"));
const Auth = lazy(() => import("./auth"));
const Login = lazy(() => import("./auth/Login"));
const Panel = lazy(() => import("./panel"));
const Dashboard = lazy(() => import("./panel/dashboard"));
const UserManagement = lazy(() => import("./panel/userManamgement"));
const SurfaceWater = lazy(() => import("./panel/waterPermit/surfaceWater"));
const SpringWater = lazy(() => import("./panel/waterPermit/springWater"));
const PondWater = lazy(() => import("./panel/waterPermit/pondWater"));

function App() {
  const [isDrawerOpen, toggleDrawer] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [theme, setTheme] = useState<TTheme>("light");
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefrshToken] = useState<string>();
  const [user, setUser] = useState<TUser | null>(null);
  const [menues, setMenues] = useState<MenuTypes[]>([]);
  const { clear } = useCache();
  const setToken = useCallback((token: string, refreshToken?: string) => {
    setAccessToken(token);
    setRefrshToken(refreshToken);
  }, []);
  const logout = useCallback(() => {
    setAccessToken("");
    setRefrshToken("");
    setUser(null);
    setMenues([]);
    utils.clearStorage();
  }, []);
  const value = useMemo(
    () =>
      ({
        title,
        accessToken,
        refreshToken,
        theme,
        user,
        menues,
        isDrawerOpen,
        setTitle,
        setTheme,
        toggleDrawer,
        setUser,
        setToken,
        setMenues,
        logout,
      } as TSharedContext),
    [user, title, theme, isDrawerOpen, accessToken, user]
  );
  useLayoutEffect(() => {
    clear();
  }, []);
  return (
    <SharedContext.Provider value={value}>
      <ConfigProvider
        theme={{
          token: {
            //...theme,
            colorIcon: colors[theme].icon,
            colorLink: colors[theme].text,
            fontFamily: "Vazir",
          },
          components: {
            Menu: {
              colorItemBgSelected: colors[theme].hover,
            },
          },
        }}
        direction="rtl"
        locale={faIR}
      >
        <ErrorBoundry fallback={() => window.location.reload}>
          <Suspense fallback={<Splash doNothing={true} />}>
            <Routes>
              <Route index element={<Navigate to={routes.panel} replace />} />
              <Route path={routes.panel} element={<Panel />}>
                <Route index element={<Dashboard />} />
                <Route path={routes.dashboard} element={<Dashboard />} />
                <Route
                  path={routes.userManagement}
                  element={<UserManagement />}
                />
                <Route
                  path={routes.surfaceWaterLicenseManagement}
                  element={<SurfaceWater />}
                />
                <Route
                  path={routes.springWaterLicenseManagement}
                  element={<SpringWater />}
                />
                <Route
                  path={routes.pondWaterLicenseManagement}
                  element={<PondWater />}
                />
                {/* <Route path={routes.profile} element={<Profile />} /> */}
              </Route>
              <Route path={routes.auth} element={<Auth />}>
                <Route index element={<Login />} />
                <Route path={routes.login} element={<Login />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundry>
      </ConfigProvider>
    </SharedContext.Provider>
  );
}

export default App;
