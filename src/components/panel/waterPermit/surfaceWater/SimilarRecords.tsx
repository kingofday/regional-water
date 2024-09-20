import { Col, Divider, Row, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import addreses from "config/api/addresses";
import useApi from "hooks/useApi";
import useSurfaceWaterColumns from "hooks/waterPermit/useSurfaceWaterColumns";
import { TSurfaceWaterSummary } from "models/surfaceWater";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
const SimilarRecords = ({ data }: { data: any }) => {
  const [getSimilarRecords, gettingSimilars, records] = useApi<
    TSurfaceWaterSummary[]
  >({
    autoCallUrl: addreses.surfacewaterpermit.similar(data.waterUserProfile),
  });
  const { t } = useTranslation();
  const columns = useSurfaceWaterColumns();
  return (
    <Row>
      <Col xs={24} sm={24}>
        <Divider orientation="left">{t("similarRecords")}</Divider>
      </Col>
      <Col xs={24} sm={24}>
        <Table
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
