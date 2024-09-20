import { Row } from "antd";
import { ReactNode } from "react";

const StepContent = ({
  active,
  id,
  children,
}: {
  active: boolean;
  id?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className="step-content"
      id={id}
      style={{ display: active ? "block" : "none", position: "relative" }}
    >
      <Row gutter={10}>{active?children:null}</Row>
    </div>
  );
};
export default StepContent;
