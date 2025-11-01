import { Hono } from "hono";
import { job, application } from ".";

const app = new Hono()
  .route("/jobs", job)
  .route("/applications", application);

export default app;
