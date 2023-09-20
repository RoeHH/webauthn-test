import {
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "https://deno.land/x/simplewebauthn/deno/server.ts";
import {
  Authenticator,
  getAuthenticators,
  getUser,
  rpID,
} from "$webauthn";
import { Handlers } from "https://deno.land/x/fresh@1.4.2/server.ts";
import { WithSession } from "$fresh-session";

export const handler: Handlers<{}, WithSession> = {
  async POST(req: Request, ctx) {  
    const { session } = ctx.state;
    const body = await req.json();

    const user = await getUser(body._options.user.name);

    const expectedChallenge = user.currentChallenge || "";

    const userAuthenticators: Authenticator[] = await getAuthenticators(user.username);

    const authenticator = userAuthenticators.at(0)

    if (!authenticator) {
      return new Response(JSON.stringify({error: `Could not find authenticator ${body.id} for user ${user.id}`}), { status: 404 });
    }

    let verification;
    try {
      verification = await verifyAuthenticationResponse({
        response: body,
        expectedChallenge,
        expectedOrigin: new URL(req.url).origin,
        expectedRPID: rpID,
        authenticator,
        requireUserVerification: false
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: error.message }));
    }

    if (verification.verified) {
      session.set("user", user);
    }

    return new Response(JSON.stringify({verified: verification.verified}));
  },
};
