import { Form as AntdForm, InputNumber } from "antd";
import util from "config/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
interface IPriceInput {
  label?: string;
  name?: string;
  form?: any;
  placeholder?: string;
  min?: number;
  max?: number;
  className?: string;
  notRequired?: boolean;
  unit?: string;
  readOnly?: boolean;
}
const PriceInput = (props: IPriceInput) => {
  const { t } = useTranslation();
  const Form = props.form || AntdForm;
  const rules = useMemo(() => {
    const result: any[] = [];
    if (!props.notRequired)
      result.push({ required: true, message: t("required") ?? "" });
    if (typeof props.min !== "undefined")
      result.push({
        validator: (rule: any, value: string, callback: any) => {
          if (!value) {
            return Promise.resolve(); // Skip validation if value is empty
          }
          if (parseFloat(value) < props.min!) {
            return Promise.reject(
              new Error(
                t("minAmountIsX", {
                  amount: util.commaThousondSeperator(props.min),
                }) ?? ""
              )
            );
          }
          return Promise.resolve();
        },
      });
    if (typeof props.max !== "undefined")
      result.push({
        validator: (rule: any, value: string, callback: any) => {
          if (!value) {
            return Promise.resolve(); // Skip validation if value is empty
          }
          if (parseFloat(value) > props.max!) {
            return Promise.reject(
              new Error(
                t("maxAmountIsX", {
                  amount: util.commaThousondSeperator(props.max),
                }) ?? ""
              )
            );
          }
          return Promise.resolve();
        },
      });
    return result;
  }, [props.notRequired, props.min, props.max]);
  return (
    <Form.Item
      name={props.name || "amount"}
      label={props.label || t("amount")}
      rules={rules}
    >
      <InputNumber
        readOnly={props.readOnly}
        stringMode={true}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => parseFloat(value!.replace(/\$\s?|(,*)/g, ""))}
        placeholder={t("amount") ?? ""}
        className={`ltr-elm placeholder-r w-100 ${props.className}`}
        controls={false}
        style={{ paddingRight: 11 }}
        prefix={t("baseCurrency") ?? props.unit}
      />
    </Form.Item>
  );
};
export default PriceInput;
