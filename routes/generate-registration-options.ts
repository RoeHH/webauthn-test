import { generateRegistrationOptions } from "https://deno.land/x/simplewebauthn/deno/server.ts";
import {
  createNewUser,
  rpID,
  rpName,
  setChallenge,
} from "../utils/webauthn.ts";
import { Handlers } from "$fresh/server.ts";


export const handler: Handlers = {
  async POST(req: Request, _ctx) {
    const body = await req.json();
    console.log(body, "body");

    const user = await createNewUser(body.username);

    

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
