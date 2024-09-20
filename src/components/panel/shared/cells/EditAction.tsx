import { Button } from "antd";
import CustomIcon from "components/shared/CustomIcon";
import useApi from "hooks/useApi";

interface IEditAction {
  findUrl?: string | ((record: any) => string);
  record: any;
  idProp: string;
  afterSelect: (record: any) => void;
}
const EditAction = (props: IEditAction) => {
  const [find, finding] = useApi<any>({
    onSuccess: (res) => {
      props.afterSelect(res);
    },
  });
  const onClick = () => {
    if (props.findUrl) {
      find.get(
        `${
          typeof props.findUrl === "string"
            ? props.findUrl
            : props.findUrl(props.record)
        }?${props.idProp}=${
          props.record[props.idProp as keyof typeof props.record]
        }`
      );
    } else {
      props.afterSelect(props.record);
    }
  };
  return (
    <Button
      loading={finding}
      type="primary"
      shape="circle"
      icon={<CustomIcon size={10} name="IoPencilOutline" />}
      onClick={onClick}
    />
  );
};
interface IEditAction {}
export default EditAction;
