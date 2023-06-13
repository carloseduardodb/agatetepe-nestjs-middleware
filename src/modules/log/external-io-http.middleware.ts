import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { HttpLoggerDto } from "../../dto/http-logger.dto";
import { ExternalLogOptionsDto } from "../../dto/log-options-external.dto";

@Injectable()
export class ExternalIOHttpMiddleware implements NestMiddleware {
  constructor(
    @Inject("LOG_OPTIONS") private logOptions: ExternalLogOptionsDto
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const eventEmitter = this.logOptions.instance;
    const eventName = this.logOptions.event;
    const send = res.send;
    const { method, originalUrl } = req;

    res.send = (exitData: any) => {
      if (
        res?.getHeader("content-type")?.toString().includes("application/json")
      ) {
        const logOutput = new HttpLoggerDto();
        logOutput.action = "output";
        logOutput.systemEvent = "external";
        logOutput.io = JSON.parse(exitData);
        eventEmitter.emit(eventName, logOutput);
      }
      res.send = send;
      return res.send(exitData);
    };

    res.on("finish", () => {
      const log = new HttpLoggerDto();
      log.action = "input";
      if (method === "POST") {
        log.io = req.body;
      } else if (method === "GET" || method === "DELETE") {
        log.io = {
          query: originalUrl,
        };
      } else if (method === "PUT" || method === "PATCH" || method === "POST") {
        log.io = {
          url: originalUrl,
          body: req.body,
        };
      } else {
        log.io = {
          url: originalUrl,
        };
      }
      log.systemEvent = "external";
      eventEmitter.emit(eventName, log);
    });

    next();
  }
}
