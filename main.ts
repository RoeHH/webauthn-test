/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import "$std/dotenv/load.ts";

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";

import { kvAdmin } from "https://raw.githubusercontent.com/RoeHH/kv-admin-fresh-plugin/main/mod.ts";

await start(manifest, {...config, port: 80, plugins: [kvAdmin]});
