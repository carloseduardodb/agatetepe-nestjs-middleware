import { HttpService } from "@nestjs/axios";
import { InternalIOHttpMiddleware } from "./internal-io-http.middleware";
import { AxiosRequestConfig } from "axios";
import {
  InjectionToken,
  OptionalFactoryDependency,
} from "@nestjs/common/interfaces";

export function InternalLogProvider(
  eventName: string,
  service: typeof HttpService,
  T: InjectionToken | OptionalFactoryDependency,
  config: AxiosRequestConfig
) {
  return {
    provide: service,
    useFactory: (issuer: typeof T) => {
      return InternalIOHttpMiddleware({
        instance: issuer,
        event: eventName,
        config: config,
      });
    },
    inject: [T],
  };
}
