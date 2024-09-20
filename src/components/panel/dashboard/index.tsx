import { useTranslation } from "react-i18next";
import Page from "../shared/Page";
import { Alert } from "antd";

const Dashboard = () => {
  const { t } = useTranslation();
  return (
    <Page id="dashboard" title="dashboard" className="page">
      <Alert
        type="success"
        message={t("appName")}
        description={t("welcomeToApp")}
        showIcon
      />
    </Page>
  );
};
export default Dashboard;
