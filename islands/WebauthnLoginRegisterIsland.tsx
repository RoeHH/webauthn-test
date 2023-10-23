import { useSignal, type Signal } from "@preact/signals";
import WebauthnLoginIsland from "./WebauthnLoginIsland.tsx";
import WebauthnRegisterIsland from "./WebauthnRegisterIsland.tsx";


interface WebauthnLoginRegisterIslandProps {
  username?: string;
}

export default function WebauthnLoginRegisterIsland({username: user}: WebauthnLoginRegisterIslandProps) {
  
  const errorMessage: Signal<string> = useSignal("");
  const username = useSignal(user ? user : "");
  const loggedIn = useSignal(user ? true : false);
  const registered = useSignal(user ? true : false);

  const handleKeyPress = async (e: KeyboardEvent) => {
    if(e.key === "Enter"){
      registered.value = await fetch('/auth/exists/' + username.value).then((result) => result.json()).then((result) => result.exists);
      username.value = (e.target as HTMLInputElement).value;
    }
  }
    
  return ( 
    <>
    {username.value === "" ? (
      <>
        <p>Enter your username to Login or Register</p>
        <input type="text" placeholder="User Name" onKeyPress={handleKeyPress}/>
      </>
    ) : registered.value === false ? (
      <>
        <p>Registering as {username.value}</p>
        <WebauthnRegisterIsland username={username} registered={registered} />
      </>
    ) : loggedIn.value === false ? (
      <>
        <p>Login as {username.value}</p>
        <WebauthnLoginIsland username={username} loggedIn={loggedIn}/>
      </>
    ): (
      <>
        <p>Logged in as {username.value}</p>
        <WebauthnRegisterIsland username={username} registered={registered} />
        <a href="/auth/logout">Logout</a>
      </>
    )}
    <p>{errorMessage.value}</p>
    </>
  );
}
