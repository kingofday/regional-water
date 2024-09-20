import { InputNumber, Form as AntdForm } from "antd";
import { Rule } from "antd/es/form";
import { NamePath } from "antd/es/form/interface";
interface IInputNumberFormItem {
  form?: any;
  name: NamePath;
  rules?: Rule[];
  label?: string;
  stringMode?: boolean;
  id?: string;
  className?: string;
  placeholder?: string;
  readOnly?:boolean;
  [key: string]: any;
}
const InputNumberFormItem = ({
  form,
  name,
  rules,
  label,
  stringMode,
  id,
  className,
  placeholder,
  readOnly,
  ...rest
}: IInputNumberFormItem) => {
  const Form = form || AntdForm;
  return (
    <Form.Item
      className={className}
      name={name}
      rules={rules}
      label={label}
      id={id}
      {...rest}
    >
      <InputNumber
        stringMode={stringMode ?? false}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
        placeholder={placeholder}
        className={`ltr-elm placeholder-r w-100 ${className}`}
        controls={false}
        readOnly={readOnly}
      />
    </Form.Item>
  );
};
export default InputNumberFormItem;
