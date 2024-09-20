import { Button, Collapse, Form, Modal, Space, Table } from "antd";
import type {
  ColumnType,
  ColumnsType,
  TablePaginationConfig,
} from "antd/es/table";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import CustomIcon from "components/shared/CustomIcon";
import config from "config";
import util from "config/utils";
import AdminPageContext from "context/AdminPageContext";
import useApi from "hooks/useApi";
import { PagedData, PagedListUpdater } from "models";
import {
  CSSProperties,
  ElementType,
  MouseEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import DeleteConfirmModal from "./ConfirmModal";
import Page from "./Page";
import EditAction from "./cells/EditAction";

const { Panel } = Collapse;
interface DeleteAction {
  icon?: string;
  url: string | ((record: any) => string);
  confirmMessage?: string;
  sendingProp?: string;
}
type EditAction = {
  icon?: string;
  url: string;
};
interface ActionColumn<T> {
  icon?: string;
  renderer?: (
    text: string,
    record: T,
    setData: PagedListUpdater<T>
  ) => ReactNode;
  action?: (record: T, setData: PagedListUpdater<T>) => void;
}
interface AdminPageProps<T> {
  title: string;
  id?: string;
  idProp: string;
  children: ReactNode;
  EntryForm?: ElementType;
  filterUrl: string;
  addUrl?: string;
  findUrl?: string | ((record: T) => string);
  columns: ColumnsType<T>;
  disablePaging?: boolean;
  pageSize?: number;
  initialValues?: any;
  deleteAction?: DeleteAction;
  editAction?: EditAction;
  handleSubmit?: boolean;
  checkIsMerchant?: boolean;
  enableRowNumber?: boolean;
  buttons?: {
    onClick: (e: MouseEvent<HTMLElement>, data: any) => void;
    className?: string;
    loading?: boolean;
    children: ReactNode;
    style?: CSSProperties;
    type?: "default" | "link" | "text" | "ghost" | "primary" | "dashed";
  }[];
  customActions?: ActionColumn<T>[];
  scrollX?: string | number;
  filtersHeight?: number;
  scrollY?: number;
  entryModalWidth?: number;
}
const AdminPage = <DataType extends Object>({
  id,
  title,
  columns,
  idProp,
  filterUrl,
  findUrl,
  addUrl,
  initialValues,
  disablePaging,
  EntryForm,
  children,
  deleteAction,
  editAction,
  pageSize = 15,
  handleSubmit = true,
  customActions,
  buttons,
  scrollX = "1500px",
  filtersHeight,
  scrollY,
  entryModalWidth,
  enableRowNumber = true,
}: AdminPageProps<DataType>) => {
  const { t } = useTranslation();
  const [filterFrm] = Form.useForm();
  const [entryFrm] = Form.useForm();
  const [modal, toggleModal] = useState(false);
  const [collapsed, toggleCollapsed] = useState(true);
  const [selected, select] = useState<DataType | null>(null);
  const [recordForRemove, toggleConfirmModal] = useState<DataType | null>(null);
  const [innerColumns, setInnerColumns] = useState(columns);
  const [paging, setPaging] = useState({
    pageNumber: 1,
    pageSize: pageSize,
  });
  const pn = useRef<number>(1);
  const [filter, loading, data, setData] = useApi<PagedData<DataType>>({
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
        setData(
          (s) =>
            ({
              ...s,
              totalEntitiesCount: s?.totalEntitiesCount ?? 1 - 1,
              results: s?.results.filter((x) => x[prop] !== id),
            } as PagedData<DataType>)
        );
      toggleConfirmModal(null);
    },
  });
  const onEditSuccess = (params: any, closeModal: boolean = true) => {
    let prop = idProp as keyof DataType;
    let id = params?.[prop];
    if (id)
      setData(
        (s) =>
          ({
            ...s,
            results: s?.results.map((x) =>
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
    if (closeModal) toggleModal(false);
  };
  const onAddSuccess = (newItem: DataType, closeModal: boolean = true) => {
    let prop = idProp as keyof DataType;
    let id = newItem?.[prop];
    if (id)
      setData(
        (s) =>
          ({
            ...s,
            totalEntitiesCount: s?.totalEntitiesCount ?? 0 + 1,
            results: [newItem, ...(s?.results ?? [])],
          } as PagedData<DataType>)
      );
    entryFrm.resetFields();
    if (closeModal) toggleModal(false);
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
      del.delete(
        typeof deleteAction?.url === "string"
          ? deleteAction?.url
          : deleteAction?.url(recordForRemove),
        {
          [deleteAction?.sendingProp ?? idProp]:
            recordForRemove[(idProp ?? "id") as keyof DataType],
        }
      );
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
      align: "center",
      key: "actions",
      fixed: "right",
      width: count * 25 + 8 * (count - 1) + 40,
      dataIndex: "actions",
      render: function (text, record, index) {
        return (
          <Space className="actions">
            {!!editAction && (
              <EditAction
                findUrl={findUrl}
                afterSelect={onEdit}
                idProp={idProp}
                record={record}
              />
            )}
            {!!deleteAction && (
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
  }, [customActions]);

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
  const onFilter = (data: any) => {
    setPaging((x) => ({ ...x, pageNumber: 1 }));
    pn.current = 1;
    if (
      columns.length !== innerColumns.length ||
      columns.some((x) => !innerColumns.map((i) => i.key).includes(x.key))
    ) {
      setInnerColumns(columns);
    }
    getData({ ...data, pageNumber: 1 });
  };
  const onEntrySubmit = (record: DataType) => {
    if (editAction && selected) edit.put(editAction.url, record);
    else if (addUrl && !selected) add.post(addUrl, record);
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
    pn.current = pagination.current ?? 1;
    getData({
      ...filterFrm.getFieldsValue(),
      pageNumber: pagination.current ?? 1,
    });
  };

  useEffect(() => {
    getData(filterFrm.getFieldsValue());
  }, []);
  const columnsList = useMemo(() => {
    let list = actionsCol
      ? [
          ...innerColumns
            .filter((x) => x.key !== "rowNumber")
            .map((c) => ({
              ...c,
              fixed:
                window.outerWidth < config.breakpoints.lg ? undefined : c.fixed,
            })),
          actionsCol,
        ]
      : innerColumns.filter((x) => x.key !== "rowNumber");
    if (enableRowNumber) {
      list.unshift({
        key: "rowNumber",
        title: "#",
        width: 80,
        fixed: window.outerWidth < config.breakpoints.lg ? undefined : "left",
        render: (value, record, index) => {
          return <span>{(pn.current - 1) * paging.pageSize + index + 1}</span>;
        },
      });
    }
    return list;
  }, [innerColumns]);
  return (
    <AdminPageContext.Provider value={{ form: filterFrm }}>
      <Page id={id} title={title} className="admin">
        <Collapse
          defaultActiveKey={["filters"]}
          onChange={() => toggleCollapsed((s) => !s)}
          //onChange={onChange}
          //expandIconPosition={expandIconPosition}
        >
          <Panel
            header={t("filters")}
            key="filters"
            extra={
              !addUrl ? null : (
                <Button
                  icon={<CustomIcon name="IoAdd" />}
                  onClick={onAdd}
                  type="primary"
                  size="small"
                  title={t("add") ?? ""}
                >
                  <small>{t("add")}</small>
                </Button>
              )
            }
          >
            <Form
              name="filters"
              form={filterFrm}
              initialValues={initialValues}
              onFinish={onFilter}
              autoComplete="off"
            >
              {children}
              <Form.Item className="flex-row-end btns">
                {buttons?.map((x) => (
                  <Button
                    type={"primary" ?? x.type}
                    htmlType="button"
                    style={x.style}
                    className={x.className}
                    onClick={(e) => x.onClick(e, filterFrm.getFieldsValue())}
                  >
                    {x.children}
                  </Button>
                ))}
                <Button type="primary" htmlType="submit">
                  {t("filter")}
                </Button>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
        <Table
          loading={loading}
          direction="rtl"
          rowKey={idProp}
          key={`table-${idProp}`}
          columns={columnsList}
          dataSource={data === null ? undefined : [...data.results]}
          onChange={onTableChange}
          scroll={{
            x: scrollX,
            y: scrollY
              ? scrollY + (collapsed ? 0 : filtersHeight ?? 0)
              : scrollY,
          }}
          pagination={
            disablePaging
              ? undefined
              : {
                  pageSize: paging.pageSize,
                  current: paging.pageNumber,
                  total: data?.totalEntitiesCount,
                }
          }
        />
        {!!EntryForm &&
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
              width={entryModalWidth}
            >
              <Form
                id="entry-form"
                layout="vertical"
                form={entryFrm}
                initialValues={selected ?? undefined}
                onFinish={onEntrySubmit}
                autoComplete="off"
              >
                <EntryForm form={entryFrm} data={selected} />
              </Form>
            </Modal>
          ) : (
            <Modal
              destroyOnClose
              open={modal}
              onCancel={() => {
                entryFrm.resetFields();
                toggleModal(false);
              }}
              title={selected ? t("edit") : t("add")}
              footer={null}
              width={entryModalWidth}
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
    </AdminPageContext.Provider>
  );
};
export default AdminPage;
