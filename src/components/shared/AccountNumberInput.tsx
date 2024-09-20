import { Form as AntdForm, InputNumber } from "antd";
import { useTranslation } from "react-i18next";

interface ICardNumber {
  form?: any;
  name?: string;
  label?: string;
  notRequired?: boolean;
  placeholder?: string;
  className?: string;
}
const AccountNumberInput = (props: ICardNumber) => {
  const Form = props.form || AntdForm;
  const { t } = useTranslation();
  return (
    <Form.Item
      name={props.name || "accountNumber"}
      label={props.label || t("accountNumber")}
      rules={[
        {
          required: true,
          message: t("required") ?? "",
        },
      ]}
    >
      <InputNumber
        stringMode={true}
        controls={false}
        placeholder={props.label || t("accountNumber") || ""}
        className={`ltr-elm placeholder-r w-100 ${props.className}`}
      />
    </Form.Item>
  );
};
export default AccountNumberInput;
