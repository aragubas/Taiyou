import { NextFunction, Request, Response } from "express";

export default function(request: Request, response: Response, next: NextFunction)
{
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");

  next();
}