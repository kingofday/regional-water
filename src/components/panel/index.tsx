import { Layout as AntLayout, Drawer } from "antd";
import LayoutHeader from "components/panel/shared/Header";
import Splash from "components/Splash";
import config from "config";
import { navigateTo } from "config/routes";
import storageKeys from "config/storageKeys";
import util from "config/utils";
import SharedContext from "context/SharedContext";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Menu from "./shared/Menu";

const { Sider, Content } = AntLayout;
const Panel = () => {
  let token = util.getStoredData(storageKeys.token);
  const { user, isDrawerOpen, toggleDrawer } = useContext(SharedContext);
  // const user = useRecoilValue(AtomUser);
  //const { lightMode } = useSelector((x) => x.theme);
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const width = window.outerWidth;

  if (user)
    return (
      <AntLayout id="panel" hasSider={true}>
        <Drawer
          placement={i18n.dir() === "rtl" ? "right" : "left"}
          onClose={() => toggleDrawer(false)}
          open={isDrawerOpen}
          className="drawer"
        >
          <Menu />
        </Drawer>
        {width > config.breakpoints.xs && (
          <Sider width={width > 1400 ? 257 : 220}>
            <Menu />
          </Sider>
        )}
        <AntLayout>
          <LayoutHeader />
          <Content>
            <Outlet />
          </Content>
        </AntLayout>
      </AntLayout>
    );
  else if (token) {
    return <Splash doNothing={false} />;
  } else
    return (
      <Navigate to={navigateTo.login} state={{ from: location }} replace />
    );
};
export default Panel;
