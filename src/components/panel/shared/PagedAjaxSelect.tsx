import { Select, Spin, Form } from "antd";
import { Rule } from "antd/es/form";
import util from "config/utils";
import useApi from "hooks/useApi";
import { PagedData } from "models";
interface PagedAjaxSelectProps<T> {
    name: string;
    label?: string;
    rules?: Rule[];
    apiUrl: string;
    valueKey: string;
    labelKey: string;
    params?: any;
    sendingKey?: string;
    placeholder?: string;
    allowClear?: boolean;
    disabled?: boolean;
    afterSearch?: (items: T[]) => PagedData<T>
    afterChange?: (value: string) => void;
}
const PagedAjaxSelect = <T,>({
    name,
    label,
    rules,
    apiUrl,
    valueKey,
    labelKey,
    params,
    sendingKey = "name",
    placeholder,
    allowClear = true,
    disabled,
    afterSearch,
    afterChange
}: PagedAjaxSelectProps<T>) => {
    //const { t } = useTranslation();
    const [call, loading, data] = useApi<PagedData<T>>({
        onSuccess: (res) => {
            afterSearch?.(res?.results ?? [])
        }
    });
    const onSearch = (value: string) => {
        call.get(`${apiUrl}?${params ? util.convertToQueryString(params) + "&" : ""}${sendingKey}=${value}`);
        afterChange?.(value);
    }
    return <Form.Item
        name={name}
        label={label}
        rules={rules}
    >
        <Select
            disabled={disabled}
            placeholder={placeholder}
            allowClear={allowClear}
            onSearch={onSearch}
            showSearch
            filterOption={false}
            options={data?.results.map(x => ({
                label: x[labelKey as keyof typeof x],
                value: x[valueKey as keyof typeof x]
            }))}
            notFoundContent={loading ? <Spin size="small" /> : null} />
    </Form.Item>
}
export default PagedAjaxSelect;