import { Hono } from "hono";
import { job } from ".";

const app = new Hono()
  .route("/jobs", job);

export default app;
