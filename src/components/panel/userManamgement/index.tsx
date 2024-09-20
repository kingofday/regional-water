import { Button, Col, Form, Input, Row } from "antd";
import AdminPage from "components/panel/shared/AdminPage";
import ConfirmModal from "components/panel/shared/ConfirmModal";
import CustomIcon from "components/shared/CustomIcon";
import addreses from "config/api/addresses";
import useApi from "hooks/useApi";
import { PagedData, PagedListUpdater } from "models";
import { TUserSummary } from "models/user";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import NumberCell from "../shared/cells/NumberCell";
import EntryForm from "./EntryForm";

const User = () => {
  const { t } = useTranslation();
  const [userToChange, selectUser] = useState<{
    user: TUserSummary;
    updater: PagedListUpdater<TUserSummary>;
  } | null>(null);
  const [changeStatus, changing] = useApi({
    onSuccess: (_, params) => {
      userToChange?.updater(
        (s) =>
          ({
            ...s,
            results: [
              ...(s?.results.map((x) =>
                x.id !== userToChange.user.id
                  ? x
                  : {
                      ...x,
                      isEnabled: !userToChange.user.isEnabled,
                    }
              ) ?? []),
            ],
          } as PagedData<TUserSummary>)
      );
      selectUser(null);
    },
  });
  const handleChangeStatus = () => {
    changeStatus.post(
      addreses.userManager.changeStatus(
        userToChange!.user.id,
        !userToChange!.user.isEnabled
      )
    );
  };
  return (
    <>
      <AdminPage<TUserSummary>
        title={t("usersManagement")}
        id="user"
        idProp="id"
        EntryForm={EntryForm}
        filterUrl={addreses.userManager.list}
        findUrl={(record) => addreses.userManager.find(record.id)}
        columns={[
          {
            title: t("fullName"),
            dataIndex: "fullName",
            key: "fullName",
            fixed: "left",
            render: function (text, record, index) {
              return <span>{`${record.firstName} ${record.lastName}`}</span>;
            },
          },
          {
            title: t("nationalCode"),
            dataIndex: "nationalCode",
            key: "nationalCode",
          },
          {
            title: t("email"),
            dataIndex: "emailAddress",
            key: "emailAddress",
            width: 220,
            render: function (text, record, index) {
              return <a href={`mailto:${text}`}>{text}</a>;
            },
          },
          {
            title: t("baseSalary"),
            dataIndex: "baseSalary",
            key: "baseSalary",
            render: (text) => <NumberCell value={text} />,
          },
          {
            title: t("organizationLevel"),
            dataIndex: "organizationLevelName",
            key: "organizationLevelName",
            width:200,
            render: (text) => <span>{text}</span>,
          }
        ]}
        scrollX={1000}
        deleteAction={{
          url: (record) => addreses.userManager.delete(record.id),
        }}
        addUrl={addreses.userManager.add}
        editAction={{
          url: addreses.userManager.update,
        }}
        customActions={[
          {
            renderer: (text, record, updater) => {
              return (
                <Button
                  className={record.isEnabled ? "btn-warn" : "btn-success"}
                  danger={record.isEnabled}
                  type="primary"
                  shape="circle"
                  title={
                    (record.isEnabled
                      ? t("deactiveUserAccount")
                      : t("activateUserAccount")) ?? ""
                  }
                  icon={
                    <CustomIcon
                      name={
                        !record.isEnabled
                          ? "IoShieldCheckmarkOutline"
                          : "IoLockClosedOutline"
                      }
                    />
                  }
                  onClick={() =>
                    selectUser({
                      user: record,
                      updater,
                    })
                  }
                />
              );
            },
          },
        ]}
      >
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12}>
            <Form.Item name="filter" rules={[]}>
              <Input placeholder={t("search") ?? ""} />
            </Form.Item>
          </Col>
        </Row>
      </AdminPage>
      <ConfirmModal
        open={!!userToChange}
        loading={changing}
        onOk={handleChangeStatus}
        title={t("userAccount") ?? ""}
        message={
          (userToChange?.user.isEnabled
            ? t("deactiveUserAccount")
            : t("activateUserAccount")) ?? ""
        }
        onCancel={() => selectUser(null)}
      />
    </>
  );
};
export default User;
