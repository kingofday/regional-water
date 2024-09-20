import { Button, Form, FormInstance, Input, message, Spin, Upload, UploadProps } from "antd";
import { RcFile, UploadChangeParam, UploadFile, } from "antd/es/upload";
import CustomIcon from "components/shared/CustomIcon";
import config from "config";
import addreses from "config/api/addresses";
import storageKeys from "config/storageKeys";
import util from "config/utils";
import { TResponse } from "models";
import { AttachmentItem } from "models/attachment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result as string));
    reader.readAsDataURL(img);
};
interface SingleFileUploaderProps {
    attch?: AttachmentItem;
    accept?: string;
    afterUpload?: (result: any) => void;
    form: FormInstance;
}
const SingleUploader = ({
    form,
    accept,
    attch,
    afterUpload
}: SingleFileUploaderProps) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<{ url: string, id: number }>();
    const handleRemove = () => {
        setFile(undefined)
        form.setFieldValue("attachmentId", undefined)
    }
    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            const res = info.file.response as TResponse<number>;
            // Get this url from response in real world.
            if (info.file.type?.split("/")[0] === "image") {

                getBase64(info.file.originFileObj as RcFile, (url: any) => {
                    setLoading(false);
                    setFile({ url, id: res.result });
                });
            }
            else {
                setLoading(false);
                setFile({ url: "", id: res.result });
            }

            afterUpload?.(info);
            if (res && res.succeeded) {
                console.log(info, res.result)
                form.setFieldValue("attachmentId", res.result)
            }
            else {
                message.error(res ? res.messages[0] : t("unknownError"));
            }
        }
    };
    const beforeUpload = (file: RcFile) => {
        let allowed = true;
        if (accept) {
            if (!accept.split(";").includes(file.type)) {
                allowed = false;
                message.error("wrongFormat");
            }
        }
        return allowed;
    };
    console.warn("fix action addr")
    return <div className="single-uploader">
        <Upload
            accept={accept}
            name="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={`${config.apiUrl}${"addreses.attachmrntAdd"}`}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            headers={
                {
                    authorization: `Bearer ${util.getStoredData(storageKeys.token) ?? ""}`
                }
            }
        >
            {file ? file.url ? <img src={file.url} alt="avatar" style={{ maxWidth: '100%' }} /> : <CustomIcon size={50} name="FaRegFileAlt" /> :
                <div>
                    {loading ? <Spin /> : <CustomIcon name="IoAddOutline" />}
                    <div style={{ marginTop: 8 }}>{t("upload")}</div>
                </div>}
        </Upload>
        {!!file && <Button onClick={handleRemove} type="link">{t("delete")}</Button>}
        <Form.Item name="attachmentId" rules={[
            {
                required: true,
                message: t("required") ?? "",
            }]}>
            <Input type="hidden" />
        </Form.Item>
    </div>
}
export default SingleUploader;