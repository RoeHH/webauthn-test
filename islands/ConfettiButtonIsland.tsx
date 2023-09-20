import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Signal } from "@preact/signals";

export default function ConfettiButtonIsland(props: JSX.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      onClick={() => confettiFirework()}
      class="px-2 py-1 border-gray-500 border-2 rounded transition-colors bg-white hover:bg-gray-200"
    />
  );
}
