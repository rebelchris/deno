import { serve } from "https://deno.land/std@0.63.0/http/server.ts";

const server = serve({ port: 1337 });

for await (const req of server) {
  req.respond({ body: "Hello Deno!!" });
}
