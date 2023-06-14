import { HttpService } from "@nestjs/axios";
import {
  InjectionToken,
  OptionalFactoryDependency,
} from "@nestjs/common/interfaces";

export interface IInternalLogProvider {
  eventName: string;
  httpService: typeof HttpService;
  emitter: InjectionToken | OptionalFactoryDependency;
  config: InjectionToken | OptionalFactoryDependency;
}
