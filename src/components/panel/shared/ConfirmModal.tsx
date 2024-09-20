import { Modal, Typography } from "antd";
import { useTranslation } from "react-i18next";
const { Paragraph } = Typography;
interface DeleteConfirmProps {
    loading?: boolean;
    title?:string;
    message?: string;
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
}
const ConfirmModal = ({ open, onOk, loading, onCancel,title, message }: DeleteConfirmProps) => {
    const { t } = useTranslation();
    return <Modal
        title={title??t("delete")}
        open={open}
        onOk={onOk}
        onCancel={onCancel}
        okButtonProps={{ danger: true, loading }}>
        <Paragraph>{message ? message : t("areYouSure")}</Paragraph>
    </Modal>
}
export default ConfirmModal;