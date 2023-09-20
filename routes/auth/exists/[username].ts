import { PageProps } from "$fresh/server.ts";
import { getUser } from "$webauthn";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { username } = ctx.params;
    const user = await getUser(username);   
    return new Response(JSON.stringify({exists: user !== null}));
  },
};