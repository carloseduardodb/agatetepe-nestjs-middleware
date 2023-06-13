export class HttpLoggerDto {
  id: number;
  io: JSON | any;
  action: "input" | "output";
  systemEvent: "internal" | "external";
}
