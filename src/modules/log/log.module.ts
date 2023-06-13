import { Module, DynamicModule } from "@nestjs/common";
import { ExternalIOHttpMiddleware } from "./external-io-http.middleware";

@Module({})
export class LogModule {
  static register(): DynamicModule {
    return {
      module: LogModule,
      providers: [ExternalIOHttpMiddleware],
      exports: [ExternalIOHttpMiddleware],
    };
  }
}
