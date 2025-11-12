import createClient from "openapi-fetch";
import type { paths } from "./api";

export const apiClient = createClient<paths>({
  baseUrl: process.env.API_BASE_URL,
});
