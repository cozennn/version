const API_ORIGIN = "https://norda-api.houda2004houdaa.workers.dev";

interface PagesRequestContext {
  request: Request;
}

export async function onRequest(context: PagesRequestContext): Promise<Response> {
  const incoming = context.request;
  const sourceUrl = new URL(incoming.url);
  const upstreamPath = sourceUrl.pathname.replace(/^\/api(?=\/|$)/, "") || "/";
  const upstreamUrl = new URL(upstreamPath + sourceUrl.search, API_ORIGIN);
  const headers = new Headers(incoming.headers);
  headers.delete("host");

  const init: RequestInit = {
    method: incoming.method,
    headers,
    redirect: "manual"
  };
  if (incoming.method !== "GET" && incoming.method !== "HEAD") {
    init.body = incoming.body;
  }

  // The browser talks only to its own Pages origin. The Worker cookie is
  // returned through this response and becomes a host-only __Host- cookie
  // scoped to the admin Pages host, avoiding third-party-cookie blocking.
  return fetch(new Request(upstreamUrl.toString(), init));
}