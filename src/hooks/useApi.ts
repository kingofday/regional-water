import { message } from "antd";
import { AxiosError } from "axios";
import apiAxios from "config/api";
import util from "config/utils";
import { TResponse } from "models";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
import { useTranslation } from "react-i18next";
import useCache from "./useCache";

interface ActionType {
  get: (url: string) => void;
  post: (url: string, data?: unknown, widthFile?: boolean) => void;
  put: (url: string, data?: unknown) => void;
  delete: (url: string, data?: unknown) => void;
  download: (url: string, data?: unknown) => void;
}
interface Options<T, MapedT = void> {
  initialValue?: T;
  initLoading?: boolean;
  autoCallUrl?: string;
  cachingLifeTimeInSeconds?: number;
  customErrorHandler?: (err: Error) => void;
  filter?: (res: T | null) => T;
  onSuccess?: (res: T | MapedT | null, params?: any) => void;
  onFailed?: (res: Error, data?: any) => void;
  mapper?: (data: T | null) => MapedT;
}

const useApi = <T, MapedT = never>(
  options?: Options<T, MapedT>
): [
  ActionType,
  boolean,
  T | MapedT | null,
  Dispatch<SetStateAction<T | MapedT | null>>
] => {
  const [loading, toggle] = useState<boolean>(options?.initLoading ?? false);
  const [data, setData] = useState<T | MapedT | null>(
    options?.initialValue ?? null
  );
  const { t } = useTranslation();
  const cache = useCache();
  const [isPending, startTransition] = useTransition();
  const afterCall = (result: T | null, params?: any) => {
    startTransition(() => {
      let filteredData = options?.filter ? options?.filter(result) : result;
      let mapedData = options?.mapper
        ? options?.mapper(filteredData)
        : filteredData;
      setData(mapedData);
      options?.onSuccess?.(mapedData, params);
    });
  };
  const errorHandler = (err: Error, status?: number, resultCode?: number) => {
    if (!options?.customErrorHandler) {
      console.log(err.message);
      message.error(err.message);
    } else options?.customErrorHandler(err);
    if (status === 401) {
      util.clearStorage();
      window.location.href = "/";
    }
  };
  const mutate: ActionType = {
    get: async (url: string) => {
      toggle(true);
      try {
        if (
          options?.cachingLifeTimeInSeconds
        ) {
          let cachedResponse = await cache.get(url);
          if (cachedResponse) {
            afterCall(cachedResponse, { url });
            toggle(false);
            return;
          }
        }
        let result = await apiAxios.get<TResponse<T>>(url);
        if (!result.data.succeeded) {
          let jsError = new Error(
            result.data.messages[0] || (t("unknownError") as string)
          );
          errorHandler(jsError);
          options?.onFailed?.(jsError);
        } else {
          if (options?.cachingLifeTimeInSeconds) {
            cache.add(
              url,
              result.data.result,
              options.cachingLifeTimeInSeconds
            );
          }
          afterCall(result.data.result);
        }
      } catch (err) {
        let axiosErr = err as AxiosError;
        let jsError = new Error(axiosErr.message);
        errorHandler(jsError, axiosErr.response?.status);
        options?.onFailed?.(jsError);
      } finally {
        toggle(false);
      }
    },
    post: async (url: string, params: any, withFile?: boolean) => {
      toggle(true);
      try {
        let formData = null;
        if (withFile) {
          formData = new FormData();
          for (let k in params) {
            formData.append(k, params[k]);
          }
        }
        let result = await apiAxios.post<TResponse<T>>(
          url,
          withFile ? formData : params,
          {
            headers: {
              "Content-Type": withFile
                ? "multipart/form-data"
                : "application/Json",
            },
          }
        );
        if (!result.data.succeeded) {
          let jsError = new Error(
            result.data.messages[0] || (t("unknownError") as string)
          );
          errorHandler(jsError);
          options?.onFailed?.(jsError);
        } else {
          afterCall(result.data.result, params);
        }
      } catch (err) {
        let axiosErr = err as AxiosError;
        let jsError = new Error(axiosErr.message);
        errorHandler(jsError, axiosErr.response?.status);
        options?.onFailed?.(jsError);
      } finally {
        toggle(false);
      }
    },
    put: async (url: string, params: any) => {
      toggle(true);
      try {
        let result = await apiAxios.put<TResponse<T>>(url, params);
        if (!result.data.succeeded) {
          let jsError = new Error(
            result.data.messages[0] || (t("unknownError") as string)
          );
          errorHandler(jsError);
          options?.onFailed?.(jsError);
        } else {
          afterCall(result.data.result, params);
        }
      } catch (err) {
        let axiosErr = err as AxiosError;
        let jsError = new Error(axiosErr.message);
        errorHandler(jsError, axiosErr.response?.status);
        options?.onFailed?.(jsError);
      } finally {
        toggle(false);
      }
    },
    delete: async (url: string, params: any) => {
      toggle(true);
      try {
        let result = await apiAxios.delete<TResponse<T>>(
          `${url}?${util.convertToQueryString(params)}`
        );
        if (!result.data.succeeded) {
          let jsError = new Error(
            result.data.messages[0] || (t("unknownError") as string)
          );
          errorHandler(jsError);
          options?.onFailed?.(jsError);
        } else {
          afterCall(result.data.result, params);
        }
      } catch (err) {
        let axiosErr = err as AxiosError;
        let jsError = new Error(axiosErr.message);
        errorHandler(jsError, axiosErr.response?.status);
        options?.onFailed?.(jsError);
      } finally {
        toggle(false);
      }
    },
    download: async (url: string, params: any, fileName?: string) => {
      toggle(true);
      try {
        let TResponse = await apiAxios.get(
          `${url}?${util.convertToQueryString(params)}`,
          {
            responseType: "blob",
          }
        );
        const href = URL.createObjectURL(TResponse.data);

        // create "a" HTML element with href to file & click
        const link = document.createElement("a");
        link.href = href;
        if (!fileName) {
          const disposition = TResponse.headers["content-disposition"];
          console.log("dis", disposition, TResponse.headers);
          fileName = disposition && disposition.match(/filename="(.+)"/)?.[1];
        }
        link.setAttribute("download", fileName ?? "file.txt"); //or any other extension
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      } catch (err) {
        let axiosErr = err as AxiosError;
        let jsError = new Error(axiosErr.message);
        errorHandler(jsError, axiosErr.response?.status);
        options?.onFailed?.(jsError);
      } finally {
        toggle(false);
      }
    },
  };
  useEffect(() => {
    if (options?.autoCallUrl) {
      mutate.get(options?.autoCallUrl);
    }
  }, []);
  return [
    mutate,
    isPending || loading,
    data,
    setData,
  ];
};
export default useApi;
