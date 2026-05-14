import type { JsonObject } from "@prisma/client/runtime/client";

export async function handleHttpRequest(metadata: JsonObject) {
  const url = metadata.url as string;
  const method = (metadata.method as string) || "POST";
  const headers = (metadata.headers as Record<string, string>) || {};
  const body = metadata.body as Record<string, unknown> | undefined;

  if (!url) {
    throw new Error("missing url in metadata");
  }

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`action failed = ${res.status} ${res.statusText}`);
  }

  console.log(`HTTP has succeeded = ${method} ${url} → ${res.status}`);
  return res;
}
