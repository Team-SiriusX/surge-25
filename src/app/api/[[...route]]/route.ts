import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { handle } from "hono/vercel";
import { finder, sample, seeker } from "./controllers";
import { profile } from "./controllers/(profile)";
import { ZodError } from "zod";

const app = new Hono().basePath("/api");

app.onError((err, c) => {
  console.log(err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    return c.json(
      {
        error: errors.length === 1 ? errors[0] : errors.join(", "),
      },
      400
    );
  }

  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ error: "Internal Error" }, 500);
});

const routes = app
  .route("/sample", sample)
  .route("/finder", finder)
  .route("/seeker", seeker)
  .route("/profile", profile);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
