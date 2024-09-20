import { Form, Select, Spin } from "antd";
import { Rule } from "antd/es/form";
import util from "config/utils";
import AdminPageContext from "context/AdminPageContext";
import useApi from "hooks/useApi";
import { Dictionary } from "models";
import { useContext, useEffect } from "react";
interface AjaxSelectProps {
  name: string | string[];
  label?: string;
  rules?: Rule[];
  apiUrl: string;
  params?: any;
  sendingKey?: string;
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  fill?: boolean;
  init?: boolean;
  afterSearch?: (items: Dictionary) => void;
  afterChange?: (value: string, label?: string) => void;
}
const AjaxSelect = ({
  name,
  label,
  rules,
  apiUrl,
  params,
  sendingKey = "name",
  placeholder,
  allowClear = true,
  disabled,
  fill = true,
  init,
  afterSearch,
  afterChange,
}: AjaxSelectProps) => {
  const { form } = useContext(AdminPageContext);
  const [call, loading, data] = useApi<Dictionary>({
    onSuccess: (res) => {
      let currentValue = form?.getFieldValue(name);
      if (init && fill && !currentValue && res && Object.values(res).length) {
        let items = Object.keys(res);
        let firstOptValue = items.length ? items[0] : null;
        if (firstOptValue) {
          if (Array.isArray(name)) {
            const obj = form?.getFieldValue(name[0]);
            form?.setFieldValue(name[0], {
              ...obj,
              [name[1]]: firstOptValue,
            });
          } else form?.setFieldValue([name], firstOptValue);
          afterChange?.(firstOptValue, res[firstOptValue]);
        }
      }
      afterSearch?.(res ?? {});
    },
  });
  const onSearch = (value: string) => {
    call.get(
      `${apiUrl}?${
        params ? util.convertToQueryString(params) + "&" : ""
      }${sendingKey}=${value}`
    );
  };
  useEffect(() => {
    if (init) onSearch("");
  }, [init, , params]);

  return (
    <Form.Item name={name} label={label} rules={rules}>
      <Select
        disabled={disabled}
        placeholder={placeholder}
        allowClear={allowClear}
        onSearch={onSearch}
        onChange={(value, opt) => {
          afterChange?.(value, (opt as { label: string }).label);
        }}
        loading={loading}
        showSearch
        filterOption={false}
        options={
          data
            ? Object.keys(data).map((k) => ({
                label: data[k],
                value: k,
              }))
            : []
        }
        notFoundContent={loading ? <Spin size="small" /> : null}
      />
    </Form.Item>
  );
};
export default AjaxSelect;
