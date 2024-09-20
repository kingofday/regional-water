import { Button, Col, Form, Input, Modal, Row } from "antd";
import AdminPage from "components/panel/shared/AdminPage";
import addreses from "config/api/addresses";
import { useTranslation } from "react-i18next";
//import NumberCell from "../shared/cells/NumberCell";
import useSurfaceWaterColumns from "hooks/waterPermit/useSurfaceWaterColumns";
import EntryForm from "./EntryForm";
import { useState } from "react";
import CustomIcon from "components/shared/CustomIcon";
import { TSprintWaterSummary } from "models/springWater";

const SpringWater = () => {
  const { t } = useTranslation();
  const columns = useSurfaceWaterColumns();
  const [recordForDetails, toggleDetailsModal] =
    useState<TSprintWaterSummary | null>(null);
  return (
    <>
      <AdminPage<TSprintWaterSummary>
        title={t("supringWaterPermitManagement")}
        id="springWater"
        idProp="id"
        EntryForm={EntryForm}
        filterUrl={addreses.springWaterPermit.list}
        handleSubmit={false}
        columns={columns}
        scrollX={1250}
        // deleteAction={{
        //   url: (record) => addreses.springWaterPermit.delete(record.id),
        // }}
        addUrl={addreses.springWaterPermit.add}
        editAction={{
          url: addreses.springWaterPermit.update,
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
                  title={t("details") ?? ""}
                  icon={<CustomIcon name={"IoEyeOutline"} />}
                  onClick={() => toggleDetailsModal(record)}
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
      {recordForDetails && (
        <Modal
          width={1000}
          title={t("details")}
          open={true}
          footer={false}
          onCancel={() => toggleDetailsModal(null)}
        >
          <EntryForm
            data={recordForDetails}
            onCancel={() => toggleDetailsModal(null)}
            readOnly={true}
          />
        </Modal>
      )}
    </>
  );
};
export default SpringWater;
