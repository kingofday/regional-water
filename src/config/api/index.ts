import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import config from "config";
import storageKeys from "config/storageKeys";
import util from "config/utils";
//import { LoginVerifyResponse } from "models/auth";

// const getRefeshToken = async (): Promise<Response<LoginVerifyResponse | null>> => {
//   try {
//     let call = await fetch(`${config.apiUrl}${addreses.refreshToken}`, {
//       method: "POST",
//       headers: {
//         "Accept": "application/json",
//         "Content-Type": "application/json",
//         "Access-Control-Allow-Credentials": "*",
//         "Token": config.token ?? ""
//       },
//       body: JSON.stringify({
//         refreshToken: util.getStoredData(storageKeys.refreshToken)
//       })
//     });
//     let data = (await call.json()) as Response<LoginVerifyResponse | null>;
//     util.storedData(storageKeys.token, data.result?.accessToken);
//     //util.storedData(storageKeys.user, data.result?.user);
//     //util.storedData(storageKeys.menus, data.result?.menus);
//     return data;
//   }
//   catch (err) {
//     console.log("Calling Refresh Token Failed", err);
//     return {
//       isSuccess: false,
//       result: null,
//       message: "",
//       resultCode: 500
//     }
//   }
// }
const apiAxiosInstance = Axios.create({
  baseURL: config.apiUrl,
  withCredentials: false,
  timeout: config.requestTimeout,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": "*",
    "Token": config.token
  },
});

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  //console.info(`[request] [${JSON.stringify(config)}]`);
  let jwtToken = util.getStoredData(storageKeys.token)
  if (jwtToken && config.headers)
    config.headers.Authorization = `Bearer ${jwtToken}`;
  return config;
}

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  //console.error(`[request error] [${JSON.stringify(error)}]`);
  return Promise.reject(error);
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  //console.info(`[response] [${JSON.stringify(response)}]`);
  return response;
}

const onResponseError = async (error: AxiosError): Promise<AxiosError> => {
  const originalRequest = error.config;
  // if (originalRequest && error.response?.status === 401 &&
  //   error.response.data &&
  //   (error.response.data as Response<any>).resultCode === 1001
  //   && !originalRequest.headers?.retry) {
  //   let callRefreshToken = await getRefeshToken();
  //   if (!callRefreshToken.isSuccess) {
  //     return Promise.reject(error);
  //   }
  //   originalRequest.headers = {
  //     ...originalRequest.headers,
  //     Authorization: `Bearer ${callRefreshToken.result?.jwtToken.token}`,
  //     retry: true
  //   };
  //   return apiAxiosInstance(originalRequest);
  // }
  return Promise.reject(error);
}
apiAxiosInstance.interceptors.request.use(onRequest, onRequestError);
apiAxiosInstance.interceptors.response.use(onResponse, onResponseError);
export default apiAxiosInstance;