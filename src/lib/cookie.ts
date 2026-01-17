export function getCookie(name: string): string | null {
	if (typeof document === "undefined") return null;
	const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
	if (match) return decodeURIComponent(match[2]);
	return null;
}

export function setCookie(
	name: string,
	value: string,
	maxAge?: number,
	path = "/",
) {
	if (typeof document === "undefined") return;
	let cookie = `${name}=${encodeURIComponent(value)}; path=${path}`;
	if (maxAge !== undefined) {
		cookie += `; max-age=${maxAge}`;
	}
	// biome-ignore lint/suspicious/noDocumentCookie: We need to assign to document.cookie to set cookies
	document.cookie = cookie;
}

export function deleteCookie(name: string, path = "/") {
	setCookie(name, "", 0, path);
}
