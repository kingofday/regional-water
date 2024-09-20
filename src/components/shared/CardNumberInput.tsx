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
const CardNumberInput = (props: ICardNumber) => {
  const Form = props.form || AntdForm;
  const { t } = useTranslation();
  return (
    <Form.Item
      name={props.name || "cardNumber"}
      label={props.label || t("cardNumber")}
      rules={[
        {
          required: !props.notRequired,
          message: t("required") ?? "",
        },
        {
          pattern: /\d{16}/,
          message: t("wrongFormat") ?? "",
        },
      ]}
    >
      <InputNumber
        stringMode={true}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{4})+(?!\d))/g, "-")}
        parser={(value) => value!.replace(/\$\s?|(-*)/g, "")}
        placeholder={props.placeholder || t("cardNumber") || ""}
        className={`ltr-elm placeholder-r w-100 ${props.className}`}
        controls={false}
      />
    </Form.Item>
  );
};
export default CardNumberInput;
