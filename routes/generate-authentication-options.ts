import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "https://deno.land/x/simplewebauthn/deno/server.ts";
import {
  Authenticator,
  createNewTempUser,
  getAuthenticators,
  getUser,
  rpID,
  rpName,
  setChallenge,
} from "../utils/webauthn.ts";

export const handler: Handlers = {
  async POST(req: Request, _ctx) {
    const body = await req.json();
    //console.log(body, "body");


    const user = await getUser(body.username);

    if (!user) {
      return new Response(JSON.stringify({error: "User Not Found"}), { status: 404 });
    }
    
    const userAuthenticators: Authenticator[] = await getAuthenticators(user.username);

    console.log(userAuthenticators, "userAuthenticators");

    console.log(user, "user");

    const options = await generateAuthenticationOptions({
      // Require users to use a previously-registered authenticator
      allowCredentials: userAuthenticators.map((authenticator) => ({
        id: authenticator.credentialID,
        type: "public-key",
        // Optional
        transports: authenticator.transports,
      })),
      userVerification: 'discouraged'
    });

    //console.log(options, "options");

    // (Pseudocode) Remember this challenge for this user
    setChallenge(options.challenge, user);

    return new Response(JSON.stringify({
      ...options,
      user: {
        id: user.id,
        name: user.username,
      },
    }));
  },
};
