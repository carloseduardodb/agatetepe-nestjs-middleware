import { InternalIOHttpMiddleware } from "./internal-io-http.middleware";
import { AxiosRequestConfig } from "axios";
import { IInternalLogProvider } from "../../interface/internal-log-provider";

export function InternalLogProvider({
  eventName,
  httpService,
  emitter,
  config,
}: IInternalLogProvider) {
  return {
    provide: httpService,
    useFactory: (issuer: typeof emitter, http: any) => {
      return InternalIOHttpMiddleware({
        instance: issuer,
        event: eventName,
        config: http.createProviderConfig() as AxiosRequestConfig,
      });
    },
    inject: [emitter, config],
  };
}
