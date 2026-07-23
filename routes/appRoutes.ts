/* eslint-disable import/no-anonymous-default-export */

import { memoize } from "@/utils/memoize";

export default {
  rootPath: () => "/",
  examplePath: () => "/example",

  /* examples */
  exampleDynamicRouteWithParam: memoize((param: string) => `/route/${param}/`)
};
