import { ColumnsType } from "antd/es/table";
import utils from "config/utils";
import { PondRefillTypeEnum, TPondWaterSummary } from "models/pondWater";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const usePondWaterColumns = () => {
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
              <span>{`${record?.waterUserProfile?.firstName} ${record.waterUserProfile?.lastName}`}</span>
            );
          },
        },
        {
          title: `${t("nationalCode")} ${t("permitOwner")}`,
          dataIndex: "nationalCode",
          key: "nationalCode",
          render: function (text, record, index) {
            return <span>{record?.waterUserProfile?.nationalCode}</span>;
          },
        },
        {
          title: `${t("postalCode")} ${t("permitOwner")}`,
          dataIndex: "postalCode",
          key: "postalCode",
          render: function (text, record, index) {
            return <span>{record?.waterUserProfile?.postalCode}</span>;
          },
        },
        {
          title: `${t("phoneNumber")} ${t("permitOwner")}`,
          dataIndex: "phoneNumber",
          key: "phoneNumber",
          render: function (text, record, index) {
            return <span>{record?.waterUserProfile?.phoneNumber}</span>;
          },
        },
        {
          title: t("pondRefillType"),
          dataIndex: "pondRefillType",
          key: "pondRefillType",
          render(value, record, index) {
            return (
              <span>
                {utils.getEnumDescripion(PondRefillTypeEnum, record.pondRefillType)}
              </span>
            );
          },
        },
        {
          title: t("pondDedicateType"),
          dataIndex: "pondDedicateType",
          key: "pondDedicateType",
          render(value, record, index) {
            return (
              <span>
                {utils.getEnumDescripion(PondRefillTypeEnum, record.pondDedicateType)}
              </span>
            );
          },
        },
      ] as ColumnsType<TPondWaterSummary>,
    []
  );
};
export default usePondWaterColumns;
