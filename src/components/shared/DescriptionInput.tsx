import { Form as AntdForm, Input } from "antd";
import { useTranslation } from "react-i18next";
interface IDescriptionInpput {
  form?: any;
  name?: string;
  label?: string;
  notRequired?: boolean;
  placeholder?: string;
  className?: string;
}
const DescriptionInpput = (props: IDescriptionInpput) => {
  const Form = props.form || AntdForm;
  const { t } = useTranslation();
  return (
    <Form.Item
      name={props.name || "description"}
      label={props.label || t("description")}
      rules={[
        {
          required: !props.notRequired,
          message: t("required") ?? "",
        },
      ]}
    >
      <Input.TextArea
        placeholder={props.placeholder || t("description") || ""}
        className={props.className}
      />
    </Form.Item>
  );
};
export default DescriptionInpput;
