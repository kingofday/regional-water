
import { Spin } from "antd";
import { ReactNode } from "react";
import EmptyChart from "./EmptyChart";
interface ChartContainerProps {
  id: string;
  loading: boolean;
  title?: string;
  text?: ReactNode;
  height?: string;
  noData?: boolean;
  noDataText?: string;
  emptyComp?: ReactNode;
}
const ChartContainer = ({
  id,
  loading,
  text,
  title,
  noDataText,
  emptyComp,
  noData = false,
  height = '300px',
}: ChartContainerProps) => {
  return (
    <div style={{ height: height }}>
      <div
        id={id}
        style={{ display: loading || noData ? "none" : "block" }}
      ></div>
      <div
        className="chart-loader"
        style={{
          height: height,
          justifyContent: "center",
          alignItems: "center",
          display: loading ? "flex" : "none",
        }}
      >
        <Spin />
        {text}
      </div>
      <div
        className={`chart-loader`}
        style={{
          height: height,
          justifyContent: "center",
          alignItems: "center",
          display: noData ? "flex" : "none",
        }}
      >
        {!!title && <h4>{title}</h4>}
        {!!emptyComp ? emptyComp : <EmptyChart text={noDataText} />}
      </div>
    </div>
  );
};
export default ChartContainer;
