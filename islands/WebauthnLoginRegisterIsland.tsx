import { useSignal, type Signal } from "@preact/signals";
import WebauthnLoginIsland from "./WebauthnLoginIsland.tsx";
import WebauthnRegisterIsland from "./WebauthnRegisterIsland.tsx";

export default function WebauthnLoginRegisterIsland() {
  
  const errorMessage: Signal<string> = useSignal("");
  const username = useSignal(undefined);
  const loggedIn = useSignal(false);
  const registered = useSignal(false);

  const handleKeyPress = async (e: KeyboardEvent) => {
    if(e.key === "Enter"){
      username.value = (e.target as HTMLInputElement).value;
      registered.value = await fetch('/auth/exists/' + username.value).then((result) => result.json()).then((result) => result.exists);
    }
  }
    
  return (
    <>
    <p class="my-4">
      Hallo {username.value}
    </p>
    {username.value === undefined ? (
      <input type="text" placeholder="User Name" onKeyPress={handleKeyPress}/>
    ) : registered.value === false ? (
      <WebauthnRegisterIsland username={username} registered={registered} />
    ) : loggedIn.value === false ? (
      <WebauthnLoginIsland username={username} loggedIn={loggedIn}/>
    ): (
      <p>Logged in</p>
    )}
    <p>{errorMessage.value}</p>
    </>
  );
}
