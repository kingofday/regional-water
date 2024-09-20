import { ColumnType } from "antd/es/table";
import CustomIcon from "components/shared/CustomIcon";
import i18n from "i18next"
 const ActiveColumn = <T,>(): ColumnType<T> => ({
    title: i18n.t("active"),
    dataIndex: 'isActive',
    key: 'isActive',
    render: function (text, record, index) {
        return <CustomIcon name={Boolean(text) ? "IoCheckmarkOutline" : "IoCloseOutline"} />;
    }
});
export default ActiveColumn;