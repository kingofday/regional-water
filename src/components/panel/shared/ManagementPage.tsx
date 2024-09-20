import { useTranslation } from "react-i18next";
import {
  ElementType,
  useEffect,
  useState,
  useMemo,
  MouseEvent,
  ReactNode,
  useContext,
} from "react";
import { Button, Collapse, Modal, Table, Form, Space, Alert } from "antd";
import type {
  ColumnType,
  ColumnsType,
  TablePaginationConfig,
} from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import Page from "./Page";
import useApi from "hooks/useApi";
import { Updater, PagedData } from "models";
import CustomIcon from "components/shared/CustomIcon";
import util from "config/utils";
import DeleteConfirmModal from "./ConfirmModal";
import { useRecoilValue } from "recoil";
import config from "config";
import SharedContext from "context/SharedContext";
const { Panel } = Collapse;
type Action = {
  icon?: string;
  url: string;
  withFile?: boolean;
};
type DeleteAction<T> = Action & {
  confirmMessage?: string;
  sendingProp?: string;
  condition?: (record: T) => boolean;
};
interface ActionColumn<T> {
  icon?: string;
  renderer?: (text: string, record: T, setData: Updater<T>) => ReactNode;
  action?: (record: T, setData: Updater<T>) => void;
}
interface AdminPageProps<T> {
  title: string;
  id?: string;
  idProp: string;
  message?: ReactNode;
  description?: ReactNode;
  EntryForm?: ElementType;
  filterUrl: string;
  addAction?: Action;
  columns: ColumnsType<T>;
  disablePaging?: boolean;
  pageSize?: number;
  deleteAction?: DeleteAction<T>;
  editAction?: Action;
  handleSubmit?: boolean;
  customActions?: ActionColumn<T>[];
  scrollX?: string | number;
  checkIsMerchant?: boolean;
}
const ManagementPage = <DataType extends Object>({
  id,
  title,
  columns,
  idProp,
  filterUrl,
  addAction,
  EntryForm,
  deleteAction,
  editAction,
  pageSize = 15,
  handleSubmit = true,
  customActions,
  message,
  description,
  disablePaging,
  checkIsMerchant,
  scrollX = "150%",
}: AdminPageProps<DataType>) => {
  const { t } = useTranslation();
  const { user } = useContext(SharedContext);
  const [filterFrm] = Form.useForm();
  const [entryFrm] = Form.useForm();
  const [modal, toggleModal] = useState(false);
  const [selected, select] = useState<DataType | null>(null);
  const [recordForRemove, toggleConfirmModal] = useState<DataType | null>(null);
  const [paging, setPaging] = useState({
    pageNumber: 1,
    pageSize: pageSize,
  });
  const [filter, loading, data, setData] = useApi<
    DataType[] | PagedData<DataType>
  >({
    initLoading: true,
  });
  const [edit, editing] = useApi<any>({
    onSuccess: (_, params) => {
      onEditSuccess(params);
    },
  });
  const [add, adding] = useApi<any>({
    onSuccess: (newItem) => {
      onAddSuccess(newItem);
    },
  });
  const [del, deleting] = useApi<boolean>({
    onSuccess: (res, params) => {
      let prop = idProp as keyof DataType;
      let id = params?.[prop];
      if (id)
        setData((s) =>
          !disablePaging
            ? ({
                ...s,
                totalEntitiesCount: (s as PagedData<DataType>)?.totalEntitiesCount ?? 1 - 1,
                results: (s as PagedData<DataType>)?.results.filter(
                  (x) => x[prop] !== id
                ),
              } as PagedData<DataType>)
            : (s as DataType[])?.filter((x) => x[prop] !== id) ?? []
        );
      toggleConfirmModal(null);
    },
  });
  const onEditSuccess = (params: any) => {
    let prop = idProp as keyof DataType;
    let id = params?.[prop];
    if (id)
      setData((s) =>
        disablePaging
          ? (s as DataType[])?.map((x) =>
              x[prop] === id
                ? {
                    ...x,
                    ...params,
                  }
                : x
            ) ?? []
          : ({
              ...(s as PagedData<DataType>),
              items: (s as PagedData<DataType>)?.results.map((x) =>
                x[prop] === id
                  ? {
                      ...x,
                      ...params,
                    }
                  : x
              ),
            } as PagedData<DataType>)
      );
    entryFrm.resetFields();
    toggleModal(false);
  };
  const onAddSuccess = (newItem: DataType) => {
    let prop = idProp as keyof DataType;
    let id = newItem?.[prop];
    if (id)
      setData((s) =>
        disablePaging
          ? [newItem, ...((s as DataType[]) ?? [])]
          : ({
              ...s,
              totalEntitiesCount: (s as PagedData<DataType>)?.totalEntitiesCount ?? 0 + 1,
              results: [newItem, ...((s as PagedData<DataType>)?.results ?? [])],
            } as PagedData<DataType>)
      );
    entryFrm.resetFields();
    toggleModal(false);
  };
  const onEdit = (record: DataType) => {
    select(record);
    toggleModal(true);
  };
  const onDelete = (record: DataType) => {
    toggleConfirmModal(record);
  };
  const handleDelete = () => {
    if (!!recordForRemove && !!deleteAction)
      del.delete(deleteAction?.url, {
        [deleteAction?.sendingProp ?? idProp]:
          recordForRemove[(idProp ?? "id") as keyof DataType],
      });
  };

  const actionsCol = useMemo((): ColumnType<DataType> | null => {
    if (
      (!customActions || !customActions.length) &&
      !editAction &&
      !deleteAction
    )
      return null;
    const count =
      (customActions?.length ?? 0) +
      (!!editAction ? 1 : 0) +
      (!!deleteAction ? 1 : 0);
    return {
      title: <CustomIcon name="IoBuildOutline" />,
      key: "actions",
      align: "center",
      fixed: "right",
      width: count * 25 + 8 * (count - 1) + 40,
      dataIndex: "actions",
      render: function (text, record, index) {
        return (
          <Space className="actions">
            {!!editAction && (
              <Button
                type="primary"
                shape="circle"
                icon={<CustomIcon size={10} name="IoPencilOutline" />}
                onClick={() => onEdit(record)}
              />
            )}
            {!!deleteAction &&
              (deleteAction.condition
                ? deleteAction.condition(record)
                : true) && (
                <Button
                  danger
                  type="primary"
                  shape="circle"
                  icon={<CustomIcon size={10} name="IoTrashOutline" />}
                  onClick={() => onDelete(record)}
                />
              )}
            {!!customActions &&
              customActions.map((x, idx) =>
                x.renderer ? (
                  x.renderer(text, record, setData)
                ) : (
                  <Button
                    key={idx}
                    type="primary"
                    shape="circle"
                    icon={<CustomIcon size={10} name={x.icon ?? "BsDash"} />}
                    onClick={() => x.action?.(record, setData)}
                  />
                )
              )}
          </Space>
        );
      },
    };
  }, []);

  const onAdd = (e: MouseEvent) => {
    e.stopPropagation();
    select(null);
    toggleModal(true);
  };
  const getData = (data: any) => {
    filter.get(
      `${filterUrl}?${util
        .convertToQueryString({ ...paging, ...data })
        .toString()}`
    );
  };
  const onEntrySubmit = (record: DataType) => {
    if (editAction && selected) edit.put(editAction.url, record);
    else if (addAction && !selected)
      add.post(addAction.url, record, addAction.withFile);
  };
  const onTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[]
  ) => {
    setPaging({
      pageNumber: pagination.current ?? 1,
      pageSize: pagination.pageSize ?? 15,
    });
  };
  useEffect(() => {
    getData(filterFrm.getFieldsValue());
  }, [paging]);
  return (
    <Page id={id} title={title} className="management">
      <Space direction="vertical" size={"middle"}>
        {message ? (
          <Alert
            className="add"
            description={description}
            message={
              <>
                <p>{message}</p>
                {!!addAction && (
                  <Button
                    title={
                      t("add") ?? ""
                    }
                    onClick={onAdd}
                    type="primary"
                    size="small"
                  >
                    +
                  </Button>
                )}
              </>
            }
          />
        ) : null}

        <Table
          key={`table-${idProp}`}
          loading={loading}
          direction="rtl"
          rowKey={idProp}
          columns={
            actionsCol
              ? [
                  ...columns.map((c) => ({
                    ...c,
                    fixed:
                      window.outerWidth < config.breakpoints.lg
                        ? undefined
                        : c.fixed,
                  })),
                  actionsCol,
                ]
              : columns
          }
          dataSource={
            data === null
              ? undefined
              : disablePaging
              ? (data as DataType[])
              : (data as PagedData<DataType>).results
          }
          onChange={onTableChange}
          scroll={{ x: scrollX }}
          pagination={
            disablePaging
              ? undefined
              : {
                  pageSize: paging.pageSize,
                  current: paging.pageNumber,
                  total: (data as PagedData<DataType>)?.totalEntitiesCount,
                }
          }
        />
      </Space>
      {EntryForm &&
        (handleSubmit ? (
          <Modal
            destroyOnClose
            open={modal}
            onCancel={() => {
              entryFrm.resetFields();
              toggleModal(false);
            }}
            title={selected ? t("edit") : t("add")}
            onOk={() => entryFrm.submit()}
            okButtonProps={{ loading: adding || editing }}
          >
            <Form
              id="entry-form"
              layout="vertical"
              form={entryFrm}
              initialValues={selected ?? undefined}
              onFinish={onEntrySubmit}
              onFinishFailed={(values) => console.log(values)}
              autoComplete="off"
            >
              <EntryForm form={entryFrm} />
            </Form>
          </Modal>
        ) : (
          <Modal
            destroyOnClose
            open={modal}
            onCancel={() => toggleModal(false)}
            title={selected ? t("edit") : t("add")}
            footer={null}
          >
            <EntryForm
              onCancel={() => toggleModal(false)}
              data={selected}
              onSuccess={selected ? onEditSuccess : onAddSuccess}
            />
          </Modal>
        ))}
      <DeleteConfirmModal
        open={!!recordForRemove}
        loading={deleting}
        onOk={handleDelete}
        onCancel={() => toggleConfirmModal(null)}
      />
    </Page>
  );
};
export default ManagementPage;
