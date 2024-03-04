import { Response } from "express";
import { STATUS_CODES } from "node:http";

function sendErrorResponse(res: Response, status: number, error?: any) {
  return res.status(status).json({
    status,
    error: STATUS_CODES[status],
    data: error,
  });
}

export function sendServerErrorReponse(res: Response) {
  return sendErrorResponse(res, 500);
}
export function sendBadRequestReponse(res: Response, error: any) {
  return sendErrorResponse(res, 400, error?.errors || error);
}
