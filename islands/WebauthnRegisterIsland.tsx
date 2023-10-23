import type { Signal } from "@preact/signals";
import { UsernameButtonIsland } from "./UsernameButtonIsland.tsx";
import * as SimpleWebAuthnBrowser from  "https://unpkg.com/@simplewebauthn/browser/dist/bundle/index.umd.min.js";
// deno-lint-ignore ban-types 
const startRegistration = (SimpleWebAuthnBrowser as {startRegistration: Function}).startRegistration;


interface WebauthnRegisterProps {
  username: Signal<string>;
  registered: Signal<boolean>
}


export default function WebauthnRegisterIsland({username, registered}: WebauthnRegisterProps) {

  const startRegistration = async () => {
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
      confettiFirework();
    }
  };


  return (
    <UsernameButtonIsland onClick={startRegistration} username={username}>{registered.value ? "Register Aditional Passkey" : "Register"}</UsernameButtonIsland>
  );


}
