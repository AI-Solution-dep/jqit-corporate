import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const upstreamUrl = "https://portal.jqit.co.jp/wp-admin/index.php";

const forwardedRequestHeaders = [
  "accept",
  "accept-language",
  "cookie",
  "referer",
  "user-agent",
] as const;

const skippedResponseHeaders = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "set-cookie",
  "transfer-encoding",
]);

function copySetCookieHeaders(upstream: Response, headers: Headers) {
  const extendedHeaders = upstream.headers as Headers & {
    getSetCookie?: () => string[];
  };
  const cookies = extendedHeaders.getSetCookie?.();

  if (cookies?.length) {
    for (const cookie of cookies) headers.append("set-cookie", cookie);
    return;
  }

  const cookie = upstream.headers.get("set-cookie");
  if (cookie) headers.append("set-cookie", cookie);
}

async function proxyPortalAdmin(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const destination = new URL(upstreamUrl);
  destination.search = requestUrl.search;

  const requestHeaders = new Headers();
  for (const name of forwardedRequestHeaders) {
    const value = request.headers.get(name);
    if (value) requestHeaders.set(name, value);
  }
  requestHeaders.set("x-forwarded-host", "www.jqit.co.jp");
  requestHeaders.set("x-forwarded-prefix", "/portal");
  requestHeaders.set("x-forwarded-proto", "https");

  const upstream = await fetch(destination, {
    method: request.method,
    headers: requestHeaders,
    cache: "no-store",
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, name) => {
    if (!skippedResponseHeaders.has(name.toLowerCase())) {
      responseHeaders.set(name, value);
    }
  });
  copySetCookieHeaders(upstream, responseHeaders);

  const location = responseHeaders.get("location");
  if (location) {
    responseHeaders.set(
      "location",
      location.replace(
        "https://portal.jqit.co.jp",
        "https://www.jqit.co.jp/portal",
      ),
    );
  }

  return new Response(request.method === "HEAD" ? null : upstream.body, {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = proxyPortalAdmin;
export const HEAD = proxyPortalAdmin;
