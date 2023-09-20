import { generateRegistrationOptions } from "https://deno.land/x/simplewebauthn/deno/server.ts";
import {
  createNewUser,
  rpID,
  rpName,
  setChallenge,
} from "$webauthn";
import { Handlers } from "$fresh/server.ts";


export const handler: Handlers = {
  async POST(req: Request, _ctx) {
    const {username} = await req.json();

    const user = await createNewUser(username);

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: user.id,
      userName: user.username,
      attestationType: "none",
    });

    setChallenge(options.challenge, user);
    
    return Response.json(options);
  }
};
