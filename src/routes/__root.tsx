import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      {/* insert header and footer  */}
      <Outlet />
      <TanStackRouterDevtools position="bottom-right" />
    </React.Fragment>
  );
}
