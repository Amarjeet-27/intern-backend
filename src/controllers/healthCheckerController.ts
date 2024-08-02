import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

const healthcheck = asyncHandler(async (req: Request, res: Response) => {
  //TODO: build a healthcheck response that simply returns the OK status as json with a message
  console.log('Health Check Request');
  res.status(200).send("working correctly");
});

export { healthcheck };