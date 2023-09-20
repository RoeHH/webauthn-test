import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "https://deno.land/x/simplewebauthn/deno/server.ts";
import {
  createNewUserAuthenticator,
  getUser,
  rpID,
} from "$webauthn";
import { Handlers } from "https://deno.land/x/fresh@1.4.2/server.ts";

export const handler: Handlers = {
  async POST(req: Request, _ctx) {
    const body = await req.json();

    const user = await getUser(body._options.user.name);

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge: user.currentChallenge || "",
        expectedOrigin: new URL(req.url).origin,
        expectedRPID: rpID,
      });
    } catch (error) {
      console.error(error);
      return new Response(error.message, { status: 500 });
    }

    const { verified } = verification;

    createNewUserAuthenticator(user.username, verification);

    return new Response(JSON.stringify({ verified }));
  },
};
