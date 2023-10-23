import { VerifiedAuthenticationResponse, VerifiedRegistrationResponse } from "https://deno.land/x/simplewebauthn/deno/server.ts";
import { CredentialDeviceType } from "https://deno.land/x/simplewebauthn@v8.1.1/packages/server/src/deps.ts";

import "https://deno.land/std@0.201.0/dotenv/load.ts";

const kv = await await Deno.openKv();

export const rpID = "close-donkey-webauthn-test.deno.dev";
export const rpName = "RoeHs App";

export type UserModel = {
  id: string;
  username: string;
  currentChallenge?: string;
};

export type Authenticator = {
  credentialID: Uint8Array;
  credentialPublicKey: Uint8Array;
  counter: number;
  credentialDeviceType: CredentialDeviceType;
  credentialBackedUp: boolean;
  transports?: AuthenticatorTransport[];
  uuid?: string;
};

export const getUser = async (username: string): Promise<UserModel | undefined> => {
  const user = await kv.get<UserModel>(["users", username]);
  return user.value;
};

export const createNewUser = async (username: string): Promise<UserModel> => {
  const id = crypto.randomUUID();
  await kv.set(["users", username], { id, username });
  return { id, username };
};

export const setChallenge = async (challenge: string, user: UserModel) => { 
  await kv.set(["users", user.username], {
    username: user.username,
    id: user.id,
    currentChallenge: challenge,
  });
};

export const createNewUserAuthenticator = async (username: string, verifiedRegistrationResponse: VerifiedRegistrationResponse) => {
  const uuid = crypto.randomUUID();
  await kv.set(["authenticators", username, uuid],  {...verifiedRegistrationResponse.registrationInfo, uuid } || {});
};

export const getAuthenticators = async (username: string): Promise<Authenticator[]> => {       
    const iter = kv.list<string>({ prefix:["authenticators", username] });
    const authenticators = [];
    for await (const res of iter) authenticators.push(res.value);
    return authenticators;
}
