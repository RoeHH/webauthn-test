import {Plugin} from "$fresh/server.ts"
import { Middleware, PluginMiddleware } from "$fresh/src/server/types.ts";

export const webauthnPlugin: Plugin = {
    name: "webauthn",
    middlewares: [
        {
            path: "/",
            middleware: (await import("../routes/_middleware.ts")).handler as unknown as Middleware,
        },
    ],
    routes: [
        {
            path: "/auth/generate-authentication-options",
            handlers: (await import("../routes/auth/generate-authentication-options.ts")).handler,
        },
        {
            path: "/auth/generate-registration-options",
            handlers: (await import("../routes/auth/generate-registration-options.ts")).handler,
        },
        {
            path: "/auth/verify-authentication",
            handlers: (await import("../routes/auth/verify-authentication.ts")).handler,
        },
        {
            path: "/auth/verify-registration",
            handlers: (await import("../routes/auth/verify-registration.ts")).handler,
        },
        {
            path: "/auth/logout",
            handlers: (await import("../routes/auth/logout.ts")).handler,
        },
        {
            path: "/auth/exists/[username]",
            handlers: (await import("../routes/auth/exists/[username].ts")).handler,
        }
    ]
}
