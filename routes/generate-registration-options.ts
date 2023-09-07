import { generateRegistrationOptions, verifyRegistrationResponse } from 'https://deno.land/x/simplewebauthn/deno/server.ts';
import { getUser, getAuthenticatorsForUser } from "../utils/db.ts";
const kv = await Deno.openKv();

  // Human-readable title for your website
const rpName = 'SimpleWebAuthn Example';
// A unique identifier for your website
const rpID = 'didactic-space-happiness-xx9qgx4vq7jfpxvp-8000.app.github.dev';
// The URL at which registrations and authentications should occur
const origin = `https://${rpID}`;



export const handler = async (): Response => {
    const user = getUser("1");
    const userAuthenticators = [];


    
const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: 1,
    userName: "test",
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: 'none',
    // Prevent users from re-registering existing authenticators
    excludeCredentials: userAuthenticators.map(authenticator => ({
      id: authenticator.credentialID,
      type: 'public-key',
      // Optional
      transports: authenticator.transports,
    })),
  });

  console.log(options);
  kv.set(["registration", "options.challenge"], options.challenge);

  return Response.json(options);
}