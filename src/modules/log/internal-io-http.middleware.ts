import { HttpService } from "@nestjs/axios";
import { InternalLogOptionsDto } from "../../dto/log-options-internal.dto";
import { HttpLoggerDto } from "../../dto/http-logger.dto";
import { AxiosHeaders, AxiosResponse } from "axios";

interface AxiosConfigType {
  transitional: {
    silentJSONParsing: boolean;
    forcedJSONParsing: boolean;
    clarifyTimeoutError: boolean;
  };
  adapter: string[];
  transformRequest: Function[];
  transformResponse: Function[];
  timeout: number;
  xsrfCookieName: string;
  xsrfHeaderName: string;
  maxContentLength: number;
  maxBodyLength: number;
  env: {
    FormData: {
      LINE_BREAK: string;
      DEFAULT_CONTENT_TYPE: string;
    };
    Blob: null;
  };
  validateStatus: Function;
  headers: AxiosHeaders;
  method: string;
  url: string;
  data: any;
}

export function InternalIOHttpMiddleware(logOptions: InternalLogOptionsDto) {
  const eventEmitter = logOptions.instance;
  const eventName = logOptions.event;
  const httpService = new HttpService();
  httpService.axiosRef.defaults.baseURL = logOptions.config.baseURL;
  httpService.axiosRef.defaults.headers = {
    ...httpService.axiosRef.defaults.headers,
    ...logOptions.config.headers,
  };
  httpService.axiosRef.defaults.maxBodyLength = logOptions.config.maxBodyLength;
  httpService.axiosRef.defaults.maxContentLength =
    logOptions.config.maxContentLength;
  httpService.axiosRef.defaults.responseType = logOptions.config.responseType;

  const httpServiceAxiosRef = httpService.axiosRef;
  httpServiceAxiosRef.interceptors.request.use(
    (config: AxiosConfigType | any) => {
      const logOutput = new HttpLoggerDto();
      logOutput.action = "input";
      logOutput.systemEvent = "internal";
      logOutput.io = config;
      eventEmitter.emit(eventName, logOutput);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  httpServiceAxiosRef.interceptors.response.use(
    (response: AxiosResponse) => {
      const logOutput = new HttpLoggerDto();
      logOutput.action = "output";
      logOutput.systemEvent = "internal";
      logOutput.io = response;
      eventEmitter.emit(eventName, logOutput);
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return httpService;
}
