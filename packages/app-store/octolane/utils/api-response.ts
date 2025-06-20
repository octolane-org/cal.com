import type { NextApiResponse } from "next";

type ResponseData = Record<string, unknown>;
type ResponseMeta = Record<string, unknown>;

export const successResponse = <T extends ResponseData = ResponseData, M extends ResponseMeta = ResponseMeta>(
  res: NextApiResponse,
  data?: T | null,
  meta?: M | null,
  message?: string,
  code = 200
) => {
  return res.status(code).json({
    status: "success",
    code,
    ...(message && { message }),
    ...(data && { data }),
    ...(meta && { meta }),
  });
};

export const errorResponse = <M extends ResponseMeta = ResponseMeta>(
  res: NextApiResponse,
  message: string,
  code = 400,
  meta?: M | null
) => {
  return res.status(code).json({
    status: "error",
    code,
    message,
    ...(meta && { meta }),
  });
};
