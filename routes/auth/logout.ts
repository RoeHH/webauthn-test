import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    const { session } = ctx.state;

    session.clear();

    return new Response(null, {
        status: 302,
        headers: {
          Location: new URL(req.url).origin,
        },
      });
  },
};
