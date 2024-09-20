import { Form as AntdForm } from "antd";
import { Rule } from "antd/es/form";
import { ICustomDatePickerProps } from "models";
import CustomDatePicker from "./CustomDatePicker";
interface IDatePickerFormItem extends ICustomDatePickerProps {
  form?: any;
  name: string | string[];
  rules?: Rule[];
  label?: string;
  readOnly?:boolean
}
const DatePickerFormItem = (props: IDatePickerFormItem) => {
  const Form = props.form || AntdForm;
  return (
    <Form.Item className="date-picker-form-item" name={props.name} rules={props.rules} label={props.label}>
      <CustomDatePicker {...props} />
    </Form.Item>
  );
};
export default DatePickerFormItem;
