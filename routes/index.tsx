import WebauthnLoginRegisterIsland from "../islands/WebauthnLoginRegisterIsland.tsx";

export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.png"
          width="128"
          height="128"
          alt="the RoeH logo a unique corporate identity mascot"
        />
        <h1 class="text-4xl font-bold">Welcome to RoeHs Webauthn Test</h1>
        <WebauthnLoginRegisterIsland />
      </div>
    </div>
  );
}
