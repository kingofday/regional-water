import { InputNumber } from "antd";

const CustomInputNumber = (props: { stringMode?: boolean, placeholder?: string, className?: string }) => {
    return  <InputNumber
        stringMode={props.stringMode??false}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
        placeholder={props.placeholder}
        className={`ltr-elm placeholder-r w-100 ${props.className}`}
        controls={false}
    />;
}
export default CustomInputNumber;