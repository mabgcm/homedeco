import { isAllowedRemoteImageUrl } from "../../../lib/store-images";

export const runtime = "nodejs";

export async function GET(request) {
  const source = request.nextUrl.searchParams.get("src");

  if (!source || !isAllowedRemoteImageUrl(source)) {
    return new Response("Invalid image source.", { status: 400 });
  }

  try {
    const upstream = await fetch(source, {
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
      },
      cache: "force-cache"
    });

    if (!upstream.ok) {
      return new Response("Unable to fetch image.", { status: upstream.status });
    }

    const contentType =
      upstream.headers.get("content-type") || "image/jpeg";
    const body = await upstream.arrayBuffer();

    return new Response(body, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800"
      }
    });
  } catch {
    return new Response("Image proxy failed.", { status: 502 });
  }
}
