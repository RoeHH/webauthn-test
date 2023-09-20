import { useSignal, type Signal } from "@preact/signals";
import { UsernameButtonIsland } from "./UsernameButtonIsland.tsx";
import * as SimpleWebAuthnBrowser from  "https://unpkg.com/@simplewebauthn/browser/dist/bundle/index.umd.min.js";
// deno-lint-ignore ban-types 
const startAuthentication = (SimpleWebAuthnBrowser as {startAuthentication: Function}).startAuthentication;


interface WebauthnLoginProps {
  username: Signal<string>;
  loggedIn: Signal<boolean>
}


export default function WebauthnLoginIsland({username, loggedIn}: WebauthnLoginProps) {

  const errorMessage: Signal<string> = useSignal("");

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
      confettiFirework();
    }
  };

  return (
    <>
    <UsernameButtonIsland onClick={startLogin} username={username} >Login</UsernameButtonIsland>
    <p>{errorMessage.value}</p>
    </>
  );
}
