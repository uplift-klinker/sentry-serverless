import middy from "@middy/core";
import {sentryMiddleware} from "@uplift/core";

export const handler = middy(async () => {

}).use(sentryMiddleware());