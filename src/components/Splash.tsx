import { Spin } from "antd";
import { navigateTo } from "config/routes";
import storageKeys from "config/storageKeys";
import utils from "config/utils";
import SharedContext from "context/SharedContext";
import { MenuTypes, TUser } from "models";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Splash = ({ doNothing = true }: { doNothing?: boolean }) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { setToken,setUser,setMenues } = useContext(SharedContext);
  // const [refreshUser] = useApi<TUser>({
  //   onFailed: () => {
  //     util.clearStorage();
  //     nav(navigateTo.login);
  //   }
  // });
  useEffect(() => {
    if (!doNothing) {
      const user = utils.getStoredData(storageKeys.user);
      const menues = utils.getStoredData(storageKeys.menus);
      const token = utils.getStoredData(storageKeys.token);
      //const refToken = utils.getStoredData(storageKeys.refreshToken);
      if (user && menues && token){
        setMenues(menues as MenuTypes[]);
        setToken(token as string);
        setUser(user as TUser);
      } 
      else {
        utils.clearStorage();
        window.open(navigateTo.login);
      }
    }
  }, []);
  return (
    <div id="splash">
      <h1>{t("loading")}</h1>
      <Spin />
    </div>
  );
};
export default Splash;
