import { VerifiedAuthenticationResponse, VerifiedRegistrationResponse } from "https://deno.land/x/simplewebauthn/deno/server.ts";
import { CredentialDeviceType } from "https://deno.land/x/simplewebauthn@v8.1.1/packages/server/src/deps.ts";

const kv = await Deno.openKv();

export const rpID = "https://close-donkey-webauthn-test.deno.dev";
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
};

export const getUser = async (id: string): Promise<UserModel> => {
    const user = await kv.get<UserModel>(["users", id]);
    return user.value || {};
};

export const createNewTempUser = async (): Promise<UserModel> => {
  const id = crypto.randomUUID();
  const username = crypto.randomUUID();
  await kv.set(["users", id], { id, username });
  return { id, username };
};

export const setChallenge = async (challenge: string, user: UserModel) => {
  await kv.set(["users", user.id], {
    username: user.username,
    id: user.id,
    currentChallenge: challenge,
  });
};

export const createNewUserAuthenticator = async (user: UserModel, verifiedRegistrationResponse: VerifiedRegistrationResponse) => {
  await kv.set(["authenticators", user.id, crypto.randomUUID()],  verifiedRegistrationResponse.registrationInfo || {});
};

export const getAuthenticators = async (user: UserModel): Promise<Authenticator[]> => {       
    const iter = kv.list<string>({ prefix:["authenticators", user.id] });
    const authenticators = [];
    for await (const res of iter) authenticators.push(res.value);
    return authenticators;
}
