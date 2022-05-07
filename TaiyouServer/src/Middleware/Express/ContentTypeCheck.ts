import { NextFunction, Request, Response } from "express";
import GenericResponse from "../../Models/GenericResponse";

export default function(request: Request, response: Response, next: NextFunction)
{
  if (request.headers["content-type"] != "application/json")
  {
    response.statusCode = 400;
    response.send(new GenericResponse("invalid_content_type"));

    return;
  }

  next();
}