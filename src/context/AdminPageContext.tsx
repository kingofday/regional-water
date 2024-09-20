import { FormInstance } from "antd";
import { createContext } from "react";
const AdminPageContext = createContext<{
    form?: FormInstance
}>({});
export default AdminPageContext;