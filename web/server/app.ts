import "react-router";
import { createRequestHandler } from "@react-router/express";
import express from "express";

export const handler = express();

handler.use(
  createRequestHandler({
    build: () => import("virtual:react-router/server-build"),
  }),
);
