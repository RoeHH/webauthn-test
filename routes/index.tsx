import { useSignal } from "@preact/signals";
import WebauthnLoginIsland from "../islands/WebauthnLoginIsland.tsx";
import WebauthnRegisterIsland from "../islands/WebauthnRegisterIsland.tsx";

export default function Home() {
  const registered = useSignal(false);
  const loggedIn = useSignal(false);
  const username = useSignal("");
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">Welcome to Test</h1>
        <p class="my-4">
          Hallo {username.value}
        </p>
        <WebauthnRegisterIsland username={username} registered={registered} />
        <WebauthnLoginIsland username={username} loggedIn={loggedIn} />
      </div>
    </div>
  );
}
