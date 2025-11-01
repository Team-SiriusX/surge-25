import React, { Suspense } from "react";
import { QueryProvider } from "./query-provider";
import { LoaderProvider } from "./loader-provider";
import { Toaster } from "../ui/sonner";
import PageLoader from "../ui/page-loader";

export default function Providers({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryProvider>
      <Toaster richColors />
      <Suspense fallback={<PageLoader />}>
        <LoaderProvider>
          {children}
        </LoaderProvider>
      </Suspense>
    </QueryProvider>
  );
}
