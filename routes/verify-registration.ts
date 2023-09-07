import { generateRegistrationOptions, verifyRegistrationResponse } from 'https://deno.land/x/simplewebauthn/deno/server.ts';
import { getUser, getAuthenticatorsForUser } from "../utils/db.ts";
const kv = await Deno.openKv();

  // Human-readable title for your website
const rpName = 'SimpleWebAuthn Example';
// A unique identifier for your website
const rpID = 'didactic-space-happiness-xx9qgx4vq7jfpxvp-8000.app.github.dev';
// The URL at which registrations and authentications should occur
const origin = `https://${rpID}`;



export const handler: Handlers = {
    async POST(req, ctx) {
        const challenge = await kv.get(["registration", "options.challenge"]);
        
        const body = await req.json();

        console.log(body, challenge);
        

        let verification;
        try {
        verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge: challenge,
            expectedOrigin: origin,
            expectedRPID: rpID,
        });
        } catch (error) {
            console.error(error);
            return new Response(error.message, { status: 500 });
        }

        const { verified } = verification;
    }
}