import { ColumnsType } from "antd/es/table";
import NumberCell from "components/panel/shared/cells/NumberCell";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useSurfaceWaterColumns = () => {
  const { t } = useTranslation();
  return useMemo(
    () =>
      [
        {
          title: `${t("fullName")} ${t("permitOwner")}`,
          dataIndex: "fullName",
          key: "fullName",
          fixed: "left",
          render: function (text, record, index) {
            return (
              <span>{`${record.waterUserProfile.firstName} ${record.waterUserProfile.lastName}`}</span>
            );
          },
        },
        {
          title: `${t("nationalCode")} ${t("permitOwner")}`,
          dataIndex: "nationalCode",
          key: "nationalCode",
          render: function (text, record, index) {
            return <span>{record.waterUserProfile.nationalCode}</span>;
          },
        },
        {
          title: `${t("postalCode")} ${t("permitOwner")}`,
          dataIndex: "postalCode",
          key: "postalCode",
          render: function (text, record, index) {
            return <span>{record.waterUserProfile.postalCode}</span>;
          },
        },
        {
          title: `${t("phoneNumber")} ${t("permitOwner")}`,
          dataIndex: "phoneNumber",
          key: "phoneNumber",
          render: function (text, record, index) {
            return <span>{record.waterUserProfile.phoneNumber}</span>;
          },
        },
        {
          title: t("totalLandArea"),
          dataIndex: "totalLandArea",
          key: "totalLandArea",
          render: (text) => <NumberCell value={text} />,
        },
        {
          title: t("areaOfAgriculturalLands"),
          dataIndex: "areaOfAgriculturalLands",
          key: "areaOfAgriculturalLands",
          render: (text) => <NumberCell value={text} />,
        }
      ] as ColumnsType<any>,
    []
  );
};
export default useSurfaceWaterColumns;
