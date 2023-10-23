import { type Signal, useSignal } from "@preact/signals";
import * as SimpleWebAuthnBrowser from  "https://unpkg.com/@simplewebauthn/browser/dist/bundle/index.umd.min.js";
// deno-lint-ignore ban-types 
const startAuthentication = (SimpleWebAuthnBrowser as {startAuthentication: Function}).startAuthentication;
// deno-lint-ignore ban-types 
const startRegistration = (SimpleWebAuthnBrowser as {startRegistration: Function}).startRegistration;


interface WebauthnPluginIslandProps {
  username?: string;
}

export default function WebauthnPluginIsland(
  { username: user }: WebauthnPluginIslandProps,
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
    <div class="WebauthnPluginComponent">
      {username.value === ""
        ? (
          <>
            <p class="WebauthnPluginComponent">Login or Register</p>
            <input
              class="WebauthnPluginComponent"
              type="text"
              placeholder="Username"
              onKeyPress={handleKeyPress}
            />
          </>
        )
        : registered.value === false
        ? (
          <>
            <p class="WebauthnPluginComponent">
              <button class="WebauthnPluginComponent" onClick={startRegister}>
                Register
              </button>
              {} as <a  class="WebauthnPluginComponent" href="/auth/logout">{username.value}</a>
            </p>
          </>
        )
        : loggedIn.value === false
        ? (
          <>
            <p class="WebauthnPluginComponent">
              <button class="WebauthnPluginComponent" onClick={startLogin}>
                Login
              </button>
              {} as <a class="WebauthnPluginComponent" href="/auth/logout">{username.value}</a>
            </p>
          </>
        )
        : (
          <>
            <p class="WebauthnPluginComponent">Logged in as <a href="/auth/logout" class="WebauthnPluginComponent">{username.value}</a></p>
            <button class="WebauthnPluginComponent" onClick={startRegister}>Register additional Key</button>
          </>
        )}
      <p class="WebauthnPluginComponent error">{errorMessage.value}</p>
    </div>
  );
}
