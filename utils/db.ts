const kv = await Deno.openKv();


export type UserModel = {
    id: string;
    username: string;
    currentChallenge?: string;
};

  
export type Authenticator = {
    // SQL: Encode to base64url then store as `TEXT`. Index this column
    credentialID: Uint8Array;
    // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
    credentialPublicKey: Uint8Array;
    // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
    counter: number;
    // SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
    // Ex: 'singleDevice' | 'multiDevice'
    credentialDeviceType: CredentialDeviceType;
    // SQL: `BOOL` or whatever similar type is supported
    credentialBackedUp: boolean;
    // SQL: `VARCHAR(255)` and store string array as a CSV string
    // Ex: ['usb' | 'ble' | 'nfc' | 'internal']
    transports?: AuthenticatorTransport[];
};

export function getUser(id: string) {
    kv.get(["user", id]);
}

export function setUser(user: UserModel) {
    kv.set(["user", user.id], user);
}

export function getAuthenticatorsForUser(userID: string) {
    kv.get(["authenticators", userID]);
}

export function setAuthenticatorsForUser(userID: string, authenticators: Authenticator[]) {
    kv.set(["authenticators", userID], authenticators);
}
