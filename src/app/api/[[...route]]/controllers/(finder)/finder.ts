import { Hono } from "hono";
import { application, job, dashboard } from ".";

const app = new Hono()
  .route("/jobs", job)
  .route("/applications", application)
  .route("/dashboard", dashboard);

export default app;
