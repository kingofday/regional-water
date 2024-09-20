import { navigateTo } from "config/routes";
import { TSharedContext } from "models";
import { createContext } from "react";

const SharedContext = createContext<TSharedContext>({
  defaultPath: navigateTo.dashboard,
  title:"",
  isDrawerOpen:false,
  theme: "light",
  accessToken: "",
  menues: [],
  user: {
    fullName: "",
    nationalCode:"",
    phoneNumber:""
  },
  setTitle:()=>{},
  logout: () => {},
  setMenues: () => {},
  setTheme: () => {},
  setToken: () => {},
  setUser: () => {},
  toggleDrawer:()=>{}
});
export default SharedContext;
