import { Col, Divider, Row, Table } from "antd";
import addreses from "config/api/addresses";
import useApi from "hooks/useApi";
import useColumns from "hooks/waterPermit/useSpringWaterColumns";
import { TSprintWaterSummary } from "models/springWater";
import { useTranslation } from "react-i18next";
const SimilarRecords = ({ data }: { data: any }) => {
  const [getSimilarRecords, gettingSimilars, records] = useApi<
  TSprintWaterSummary[]
  >({
    autoCallUrl: addreses.springWaterPermit.similar(data.waterUserProfile),
  });
  const { t } = useTranslation();
  const columns = useColumns();
  return (
    <Row>
      <Col xs={24} sm={24}>
        <Divider orientation="left">{t("similarRecords")}</Divider>
      </Col>
      <Col xs={24} sm={24}>
        <Table<TSprintWaterSummary>
          style={{ width: "100%" }}
          pagination={false}
          dataSource={records ?? []}
          columns={columns}
          loading={gettingSimilars}
        />
      </Col>
    </Row>
  );
};
export default SimilarRecords;
