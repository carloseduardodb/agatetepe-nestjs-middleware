import { AxiosRequestConfig } from "axios";

export class InternalLogOptionsDto {
  event: string;
  instance: any;
  config: AxiosRequestConfig;
}
