import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { Signal } from "@preact/signals";

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  username: Signal<string>;
}

export function UsernameButtonIsland(props: ButtonProps) {

  const handleKeyPress = (e: KeyboardEvent) => {
    if(e.key === "Enter"){
      props.username.value = (e.target as HTMLInputElement).value;
    }
  }   

  return (
    <div>
      {props.username.value !== "" ? (        
        <button
          {...props}
          disabled={!IS_BROWSER || props.disabled}
          class="px-2 py-1 border-gray-500 border-2 rounded transition-colors bg-white hover:bg-gray-200"
        />
      ): (
        <input type="text" placeholder="User Name" onKeyPress={handleKeyPress}/>
      )}
    </div>
  );
}
