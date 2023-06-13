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
  const httpServiceAxiosRef = httpService.axiosRef;
  // Adicione o interceptor aqui
  httpServiceAxiosRef.interceptors.request.use(
    (config: AxiosConfigType | any) => {
      // Lógica personalizada para manipular a solicitação antes de ser enviada
      console.log("Interceptando a solicitação HTTP");
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
    }
  );

  httpServiceAxiosRef.interceptors.response.use((response: AxiosResponse) => {
    // Lógica personalizada para manipular a resposta recebida
    console.log("Interceptando a resposta HTTP");
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
  });

  return httpService;
}
