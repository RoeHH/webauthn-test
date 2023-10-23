import {Plugin} from "$fresh/server.ts"
import { Middleware } from "$fresh/src/server/types.ts"

export const WebauthnPlugin: Plugin = {
    name: "webauthn",
    middlewares: [
        {
            path: "/",
            middleware: (await import("../routes/_middleware.ts")) as unknown as Middleware,
        },
    ],
    routes: [
        {
            path: "/auth/generate-authentication-options",
            handler: (await import("../routes/auth/generate-authentication-options.ts")).handler,
        },
        {
            path: "/auth/generate-registration-options",
            handler: (await import("../routes/auth/generate-registration-options.ts")).handler,
        },
        {
            path: "/auth/verify-authentication",
            handler: (await import("../routes/auth/verify-authentication.ts")).handler,
        },
        {
            path: "/auth/verify-registration",
            handler: (await import("../routes/auth/verify-registration.ts")).handler,
        },
        {
            path: "/auth/logout",
            handler: (await import("../routes/auth/logout.ts")).handler,
        },
        {
            path: "/auth/exists/[username]",
            handler: (await import("../routes/auth/exists/[username].ts")).handler,
        }
    ]
}

export default WebauthnPlugin
