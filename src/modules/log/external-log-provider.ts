import {
  InjectionToken,
  OptionalFactoryDependency,
} from "@nestjs/common/interfaces";

export function ExternalLogProvider(
  eventName: string,
  T: InjectionToken | OptionalFactoryDependency
) {
  return {
    provide: "LOG_OPTIONS",
    useFactory: (issuer: typeof T) => ({
      event: eventName,
      instance: issuer,
    }),
    inject: [T],
  };
}
