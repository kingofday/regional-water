import { Form as AntdForm, Input } from "antd";
import { useTranslation } from "react-i18next";

interface IIban {
  form?: any;
  name?: string;
  label?: string;
  notRequired?: boolean;
  placeholder?: string;
  className?: string;
  readOnly?:boolean
}
const IbanInput = (props: IIban) => {
  const Form = props.form || AntdForm;
  const { t } = useTranslation();
  return (
    <Form.Item
      name={props.name || "iban"}
      label={props.label || t("sheba")}
      rules={[
        {
          required: !props.notRequired,
          message: t("required") ?? "",
        },
        {
          pattern: /\d{24}/,
          message: t("wrongFormat") ?? "",
        },
      ]}
    >
      <Input readOnly={props.readOnly} prefix="IR" placeholder={props.placeholder||t("sheba")||""} className={`ltr-elm placeholder-r w-100 ${props.className}`} />
    </Form.Item>
  );
};
export default IbanInput;
