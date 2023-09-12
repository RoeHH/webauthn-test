import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "https://deno.land/x/simplewebauthn/deno/server.ts";
import {
  createNewTempUser,
  rpID,
  rpName,
  setChallenge,
} from "../utils/webauthn.ts";

export const handler = async (): Promise<Response> => {
  const tempUser = await createNewTempUser();

  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: tempUser.id,
    userName: tempUser.username,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: "none",
  });
  setChallenge(options.challenge, tempUser);
  
  return Response.json(options);
};
