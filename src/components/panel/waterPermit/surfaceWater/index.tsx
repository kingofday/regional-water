import { Button, Col, Form, Input, Modal, Row } from "antd";
import AdminPage from "components/panel/shared/AdminPage";
import addreses from "config/api/addresses";
import { useTranslation } from "react-i18next";
//import NumberCell from "../shared/cells/NumberCell";
import useSurfaceWaterColumns from "hooks/waterPermit/useSurfaceWaterColumns";
import { TSurfaceWaterSummary } from "models/surfaceWater";
import EntryForm from "./EntryForm";
import { useState } from "react";
import CustomIcon from "components/shared/CustomIcon";

const SurfaceWater = () => {
  const { t } = useTranslation();
  const columns = useSurfaceWaterColumns();
  const [recordForDetails, toggleDetailsModal] = useState<TSurfaceWaterSummary|null>(null);
  return (
    <>
      <AdminPage<TSurfaceWaterSummary>
        title={t("surfaceWaterPermitManagement")}
        id="surfaceWater"
        idProp="id"
        EntryForm={EntryForm}
        filterUrl={addreses.surfacewaterpermit.list}
        handleSubmit={false}
        //findUrl={(record) => addreses.surfacewaterpermit.find(record.id)}
        columns={columns}
        scrollX={1250}
        // deleteAction={{
        //   url: (record) => addreses.surfacewaterpermit.delete(record.id),
        // }}
        addUrl={addreses.surfacewaterpermit.add}
        editAction={{
          url: addreses.surfacewaterpermit.update,
        }}
        entryModalWidth={1200}
        customActions={[
          {
            renderer: (text, record, updater) => {
              return (
                <Button
                  className={"btn-dark"}
                  type="primary"
                  shape="circle"
                  title={t("details")??""}
                  icon={
                    <CustomIcon
                      name={"IoEyeOutline"}
                    />
                  }
                  onClick={() =>
                    toggleDetailsModal(record)
                  }
                />
              );
            },
          },
        ]}
      >
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12}>
            <Form.Item name="search" rules={[]}>
              <Input placeholder={t("search") ?? ""} />
            </Form.Item>
          </Col>
        </Row>
      </AdminPage>
      {recordForDetails && <Modal width={1000} title={t("details")} open={true} footer={false} onCancel={()=>toggleDetailsModal(null)}>
        <EntryForm data={recordForDetails} onCancel={()=>toggleDetailsModal(null)} readOnly={true}/>
        </Modal>}
    </>
  );
};
export default SurfaceWater;
