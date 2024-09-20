import { Menu as AntMenu, Avatar, Button } from "antd";
import logoImage from "assets/files/logo.png";
import CustomIcon from "components/shared/CustomIcon";
import routes, { navigateTo } from "config/routes";
import SharedContext from "context/SharedContext";
import { MenuTypes, TMenu } from "models";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
const Menu = () => {
  const { menues, user, logout, toggleDrawer } = useContext(SharedContext);
  const [actionsIsOpen, toggleActions] = useState(false);
  const mapper = useCallback(
    (x: any) => ({
      key: x.menuId,
      label: x.name,
      itemIcon: x.icon,
      children: x.children?.map(mapper),
      title: x.name,
    }),
    []
  );
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState({
    openKeys: [routes.dashboard.toString()],
    selectedKey: "none",
  });
  const menuItems = useMemo(
    () =>
      menues.map((m) => {
        switch (m) {
          case MenuTypes.OrganizationLevelManager:
            return {
              key: "organization-level-management",
              label: t("organizationLevelManagement"),
              title: t("organizationLevelManagement"),
              icon: (
                <CustomIcon size={20} color={"var(--bg)"} name="BsUiChecks" />
              ),
              path: navigateTo.settingManagement,
            } as TMenu;
          case MenuTypes.RoleManager:
            return {
              key: "role-management",
              label: t("roleManagement"),
              title: t("roleManagement"),
              icon: (
                <CustomIcon
                  size={20}
                  color={"var(--bg)"}
                  name="BsPersonCheck"
                />
              ),
              path: navigateTo.settingManagement,
            } as TMenu;
          case MenuTypes.SettingManager:
            return {
              key: "setting-management",
              label: t("settingManagement"),
              title: t("settingManagement"),
              icon: (
                <CustomIcon
                  size={20}
                  color={"var(--bg)"}
                  name="IoSettingsOutline"
                />
              ),
              path: navigateTo.settingManagement,
            } as TMenu;
          case MenuTypes.UserManager:
            return {
              key: "user-management",
              label: t("userManagement"),
              title: t("userManagement"),
              icon: (
                <CustomIcon
                  size={20}
                  color={"var(--bg)"}
                  name="IoPeopleOutline"
                />
              ),
              path: navigateTo.userManagement,
            } as TMenu;
          case MenuTypes.WaterPermitManager:
            return {
              key: "water-license-managment",
              label: t("operationLicenseManagement"),
              title: t("operationLicenseManagement"),
              icon: (
                <CustomIcon
                  size={20}
                  color={"var(--bg)"}
                  name="MdOutlineInventory"
                />
              ),
              children: [
                {
                  key: "surface-water",
                  label: t("surfaceWater"),
                  path: navigateTo.surfaceWaterLicenseManagement,
                  icon: (
                    <CustomIcon
                      size={20}
                      color={"var(--bg)"}
                      name="MdOutlineWater"
                    />
                  ),
                },
                {
                  key: "pond-water",
                  label: t("pondWater"),
                  path: navigateTo.pondWaterLicenseManagement,
                  icon: (
                    <CustomIcon
                      size={20}
                      color={"var(--bg)"}
                      name="MdVignette"
                    />
                  ),
                },
                {
                  key: "spring-water",
                  label: t("springWater"),
                  path: navigateTo.springWaterLicenseManagement,
                  icon: (
                    <CustomIcon
                      size={20}
                      color={"var(--bg)"}
                      name="IoWaterOutline"
                    />
                  ),
                },
              ],
            } as TMenu;
          default:
            return {
              key: m,
              label: t(m),
              title: t(m),
              icon: (
                <CustomIcon size={20} color={"var(--bg)"} name="IoHelpSharp" />
              ),
              path: `/${m}`,
            };
        }
      }),
    []
  );
  const navigateToRoute = (e: any) => {
    let k = e.key;
    let item: TMenu | undefined = undefined;
    for (let m of menuItems ?? []) {
      if (!(m as any).children) item = m.key === k ? m : undefined;
      else item = (m as any).children?.find((x: any) => x.key === k);
      if (item) {
        navigate(item?.path ?? "/");
        toggleDrawer(false);
        break;
      }
    }
  };
  const location = useLocation();
  const setCurrentMenu = useCallback(() => {
    let pathname = window.location.pathname;
    let openKeys: string[] = [];
    let selectedKey: string = "none";
    for (let x of menuItems ?? []) {
      const i = x as any;
      if (!i.children) {
        if (~pathname.indexOf(i.path ?? "")) {
          selectedKey = i.key!;
          break;
        }
      } else {
        let m = i.children?.find((x: any) => ~pathname.indexOf(x.path ?? ""));
        if (m) {
          selectedKey = m.key!;
          openKeys = [i.key!];
          break;
        }
      }
    }
    console.log("selected", selectedKey);
    setState({
      openKeys,
      selectedKey,
    });
  }, []);
  const onOpenChange = (openKeys: string[]) => {
    setState((s) => ({ ...s, openKeys }));
  };
  useEffect(() => {
    setCurrentMenu();
  }, [location]);
  return (
    <div id="menu">
      <Link to="/" className="logo">
        <img src={logoImage} alt="logo" width={50} />
        <strong>{t("appName")}</strong>
      </Link>
      <AntMenu
        onClick={navigateToRoute}
        onOpenChange={onOpenChange}
        style={{ width: 256 }}
        selectedKeys={[state.selectedKey]}
        openKeys={state.openKeys}
        mode="inline"
        items={menuItems}
      />
      <div className="profile">
        <div className="content">
          <div
            className="user"
            role="button"
            onClick={() => toggleActions((s) => !s)}
          >
            <Avatar size={45}>{user?.fullName[0].toUpperCase()}</Avatar>

            <div className="info">
              <span className="name" title={user?.fullName}>
                {user?.fullName}
              </span>
              <span className="email" title={user?.nationalCode}>
                {user?.nationalCode}
              </span>
            </div>
          </div>
          <Button className="btn-toggle" type="link">
            {
              <CustomIcon
                name={actionsIsOpen ? "IoChevronDown" : "IoChevronUp"}
              />
            }
          </Button>
        </div>
        {actionsIsOpen && (
          <ul className="actions">
            <li role="button" onClick={() => navigate(navigateTo.profile)}>
              <CustomIcon size={18} name="IoPersonOutline" />
              <span>{t("profile")}</span>
            </li>
            {/* <li role="button" onClick={() => navigate(navigateTo.changePassword)}><CustomIcon size={18} name="IoKeyOutline" /><span>{t("changePassword")}</span></li> */}
            <li role="button" onClick={logout}>
              <CustomIcon size={18} name="IoPowerOutline" />
              <span>{t("logOut")} </span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};
export default Menu;
