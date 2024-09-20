import { AnPicker } from "react-anpicker";
import faLocale from "react-anpicker/dist/esm/components/Locales/faLocale";
import "react-anpicker/dist/anpicker.css";
import { useRef, useState, useEffect } from "react";
import { Button, Input, InputRef } from "antd";
import CustomIcon from "components/shared/CustomIcon";
import { ICustomDatePickerProps } from "models";
const eqValue = (value: string) => {
  let dt = new Date(value);
  let faVal = new Intl.DateTimeFormat("fa-IR").format(dt);
  let arr = faVal.split("/");
  return `${faLocale.numberConverter(arr[0])}/${faLocale.numberConverter(
    arr[1]
  )}/${faLocale.numberConverter(arr[2])}`;
};
const CustomDatePicker = ({
  placeholder,
  popupTargetId,
  value,
  onRemove,
  onChange,
  endTime,
  disabled,
  readOnly
}: ICustomDatePickerProps) => {
  const ref = useRef<InputRef>(null);
  const [innerValue, setValue] = useState<string>(() => {
    if (value) {
      return eqValue(value);
    } else {
      return "";
    }
  });
  const handleFocus = () => ref.current?.focus();
  const handleChange = (dt: string) => {
    if (dt) {
      const [y, m, d] = dt.split("/");
      const res = faLocale.convertToDate(parseInt(y), parseInt(m), parseInt(d));
      const newDT = endTime
        ? new Date(res[0], res[1] - 1, res[2], 23, 59, 59, 0)
        : new Date(res[0], res[1] - 1, res[2], 0, 0, 0, 0);
      onChange?.(newDT.toISOString() ?? null);
    } else {
      onChange?.(null);
    }
  };
  useEffect(() => {
    if (typeof value !== "undefined") {
      const v = eqValue(value);
      if (
        (value == null && innerValue !== null) ||
        (innerValue === null && value !== null) ||
        v !== innerValue
      ) {
        setValue(v);
      }
    }
  }, [value]);
  return (
    <AnPicker
      showSidebar={false}
      inputControl={(props) => (
        <Input
          ref={ref}
          readOnly={readOnly}
          suffix={
            onRemove && value ? (
              <Button type="link" onClick={() => onRemove()}>
                <CustomIcon size={16} name="IoCloseOutline" />{" "}
              </Button>
            ) : (
              <Button type="link" onClick={handleFocus}>
                <CustomIcon size={16} name="IoCalendarClearOutline" />
              </Button>
            )
          }
          disabled={disabled}
          placeholder={placeholder}
          {...props}
        />
      )}
      popupTargetId={popupTargetId}
      onChange={handleChange}
      value={innerValue}
    />
  );
};
export default CustomDatePicker;
