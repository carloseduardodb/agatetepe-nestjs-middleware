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
  httpService.axiosRef.defaults = logOptions.config as any;
  const httpServiceAxiosRef = httpService.axiosRef;
  httpServiceAxiosRef.interceptors.request.use(
    (config: AxiosConfigType | any) => {
      const logOutput = new HttpLoggerDto();
      logOutput.action = "input";
      logOutput.systemEvent = "internal";
      logOutput.io = {
        url: config.url,
        data: config?.data,
        method: config?.method,
      };
      eventEmitter.emit(eventName, logOutput);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  httpServiceAxiosRef.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log("Interceptando a resposta HTTP");
      console.log("logOptions, ", logOptions.config);
      const logOutput = new HttpLoggerDto();
      logOutput.action = "output";
      logOutput.systemEvent = "internal";
      logOutput.io = {
        url: response.config.url,
        data: response.data,
        method: response.config.method,
        status: response.status,
        statusText: response.statusText,
      };
      eventEmitter.emit(eventName, logOutput);
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return httpService;
}
