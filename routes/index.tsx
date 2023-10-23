import WebauthnLoginRegisterIsland from "../islands/WebauthnLoginRegisterIsland.tsx";
import ConfettiButtonIsland from "../islands/ConfettiButtonIsland.tsx";
import { WithSession } from "$fresh-session";
import WebatuhnPluginIsland from "../islands/WebatuhnPluginIsland.tsx";

export type Data = { session: Record<string, string> };

export const handler: Handlers<
  Data,
  WithSession 
> = {
  GET(_req, ctx) {
    const { session } = ctx.state;

    return ctx.render({
      session: session.data
    });
  },
};

export default function Home({ data }: PageProps<Data>) {
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
        <WebatuhnPluginIsland username={data.session.user?.username} />
        <br />
        <ConfettiButtonIsland>Confetti 🥳</ConfettiButtonIsland>
      </div>
    </div>
  );
}
