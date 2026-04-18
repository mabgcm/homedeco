const ALLOWED_IMAGE_HOSTS = ["cjdropshipping.com", "m.media-amazon.com"];

export function isAllowedRemoteImageUrl(value) {
  try {
    const url = new URL(String(value || ""));

    if (!["http:", "https:"].includes(url.protocol)) {
      return false;
    }

    return ALLOWED_IMAGE_HOSTS.some((host) => {
      return url.hostname === host || url.hostname.endsWith(`.${host}`);
    });
  } catch {
    return false;
  }
}

export function toStoreImageUrl(value) {
  if (!value || String(value).startsWith("data:image")) {
    return value;
  }

  if (!isAllowedRemoteImageUrl(value)) {
    return value;
  }

  return `/api/image?src=${encodeURIComponent(value)}`;
}
