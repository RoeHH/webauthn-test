import { type Signal, useSignal } from "@preact/signals";
import * as SimpleWebAuthnBrowser from  "https://unpkg.com/@simplewebauthn/browser/dist/bundle/index.umd.min.js";
// deno-lint-ignore ban-types 
const startAuthentication = (SimpleWebAuthnBrowser as {startAuthentication: Function}).startAuthentication;
// deno-lint-ignore ban-types 
const startRegistration = (SimpleWebAuthnBrowser as {startRegistration: Function}).startRegistration;


interface WebatuhnPluginIslandProps {
  username?: string;
}

export default function WebatuhnPluginIsland(
  { username: user }: WebatuhnPluginIslandProps,
) {

  const errorMessage: Signal<string> = useSignal("");
  const username = useSignal(user ? user : "");
  const loggedIn = useSignal(user ? true : false);
  const registered = useSignal(user ? true : false);

  const handleKeyPress = async (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      username.value = (e.target as HTMLInputElement).value;
      registered.value = await fetch("/auth/exists/" + username.value).then((
        result,
      ) => result.json()).then((result) => result.exists);
    }
  };

  const startRegister = async () => {
    const authenticationOptions = await fetch('/auth/generate-registration-options', {
      method: 'POST',
      body: JSON.stringify({username: username.value}),
    }).then((result) => result.json());

    const authenticationResponse = await startRegistration(authenticationOptions);    

    const registerResult = await fetch('/auth/verify-registration', {
      method: 'POST',
      body: JSON.stringify({...authenticationResponse, _options: authenticationOptions}),
    }).then((result) => result.json());

    if (registerResult.verified) {
      registered.value = registerResult.verified;
      username.value = authenticationOptions.user.name;
    }
  };

  const startLogin = async () => {
    const authenticationOptions = await fetch('/auth/generate-authentication-options', {
      method: 'POST',
      body: JSON.stringify({username: username.value}),
    }).then((result) => result.json());

    if(authenticationOptions.error) {
      username.value = "";
      errorMessage.value = authenticationOptions.error;
    }

    const authenticationResponse = await startAuthentication(authenticationOptions);

    const loginResult = await fetch('/auth/verify-authentication', {
      method: 'POST',
      body: JSON.stringify({...authenticationResponse, _options: authenticationOptions}),
    }).then((result) => result.json());

    if (loginResult.verified) {
      loggedIn.value = loginResult.verified;
    }
  };

  return (
    <>
      {username.value === ""
        ? (
          <>
            <p>Enter your username to Login or Register</p>
            <input
              type="text"
              placeholder="User Name"
              onKeyPress={handleKeyPress}
            />
          </>
        )
        : registered.value === false
        ? (
          <>
            <p>Registering as {username.value}</p>
            <button onClick={startRegister}>Register</button>
          </>
        )
        : loggedIn.value === false
        ? (
          <>
            <p>Login as {username.value}</p>
            <button onClick={startLogin}>
              Login
            </button>
          </>
        )
        : (
          <>
            <p>Logged in as {username.value}</p>
            <button onClick={startRegister}>Register aditional Key</button>
            <a href="/auth/logout">Logout</a>
          </>
        )}
      <p>{errorMessage.value}</p>
    </>
  );
}
