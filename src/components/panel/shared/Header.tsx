import { Layout as AntLayout, Button } from "antd";
import routes from "config/routes";
import SharedContext from "context/SharedContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import CustomIcon from "../../shared/CustomIcon";
const Header = () => {
  const {title, theme,setTheme,toggleDrawer} = useContext(SharedContext);
  const handleTheme = () => {
    setTheme(theme==="dark"?"light":"dark")
  };
  return (
    <AntLayout.Header id="header">
      <div className="breadcrumb">
        <Button type="link" id="btn-toggle-menu" onClick={() => toggleDrawer(true)}>
          <CustomIcon size={20} name="IoReorderFourOutline" />
        </Button>
        <strong>{title}</strong>
      </div>
      <div className="actions">
        {/* <Link className={`center a-notif`} to={`/${routes.notifications}`}>
          <CustomIcon name="IoNotificationsOutline" size={16} />
        </Link>
        <span className="divider"></span> */}
        <Button onClick={handleTheme} type="link">
          <CustomIcon name="IoMoonOutline" size={16} />
        </Button>
      </div>
    </AntLayout.Header>
  );
};
export default Header;
