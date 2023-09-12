import {
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "https://deno.land/x/simplewebauthn/deno/server.ts";
import {
Authenticator,
  createNewUserAuthenticator,
  getAuthenticators,
  getUser,
  rpID,
} from "../utils/webauthn.ts";
import { Handlers } from "https://deno.land/x/fresh@1.4.2/server.ts";

export const handler: Handlers = {
  async POST(req: Request, _ctx) {
    const body = await req.json();

    //console.log(body);

    const user = await getUser(body._options.user.id);

    const expectedChallenge = user.currentChallenge || "";
    //console.log(body, "body");

    const userAuthenticators: Authenticator[] = await getAuthenticators(user);
    //console.log(userAuthenticators, "authenticators");
    //console.log(new TextEncoder().encode(body.id), "new TextEncoder().encode(body.id)");

    const authenticator = userAuthenticators.at(0)

    if (!authenticator) {
      throw new Error(
        `Could not find authenticator ${body.id} for user ${user.id}`,
      );
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

    //console.log(verification);

    return new Response(JSON.stringify({verified: verification.verified}));
  },
};
