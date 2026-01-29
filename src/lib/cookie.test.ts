import { afterEach, describe, expect, it, vi } from "vitest";
import { deleteCookie, getCookie, setCookie } from "./cookie";

describe("cookie utilities", () => {
	afterEach(() => {
		// Clear all cookies after each test
		const cookies = document.cookie.split(";");
		for (const cookie of cookies) {
			const eqPos = cookie.indexOf("=");
			const name =
				eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
			if (name) {
				// biome-ignore lint/suspicious/noDocumentCookie: Allowed for testing purposes
				document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
			}
		}
		vi.restoreAllMocks();
	});

	describe("getCookie", () => {
		it("returns the cookie value when the cookie exists", () => {
			// biome-ignore lint/suspicious/noDocumentCookie: Allowed for testing purposes
			document.cookie = "testCookie=testValue";
			expect(getCookie("testCookie")).toBe("testValue");
		});

		it("returns null when the cookie does not exist", () => {
			// biome-ignore lint/suspicious/noDocumentCookie: Allowed for testing purposes
			document.cookie = "otherCookie=otherValue";
			expect(getCookie("nonExistent")).toBeNull();
		});

		it("handles multiple cookies", () => {
			// biome-ignore lint/suspicious/noDocumentCookie: Allowed for testing purposes
			document.cookie = "first=1";
			// biome-ignore lint/suspicious/noDocumentCookie: Allowed for testing purposes
			document.cookie = "second=2";
			// biome-ignore lint/suspicious/noDocumentCookie: Allowed for testing purposes
			document.cookie = "third=3";
			expect(getCookie("second")).toBe("2");
		});

		it("decodes URI-encoded values", () => {
			// biome-ignore lint/suspicious/noDocumentCookie: Allowed for testing purposes
			document.cookie = "encoded=hello%20world";
			expect(getCookie("encoded")).toBe("hello world");
		});

		it("returns null when the document is undefined (SSR)", () => {
			const originalDocument = global.document;
			// @ts-expect-error - Testing undefined document for SSR
			global.document = undefined;
			expect(getCookie("test")).toBeNull();
			global.document = originalDocument;
		});
	});

	describe("setCookie", () => {
		it("sets a cookie and retrieving it returns the value", () => {
			setCookie("test", "value");
			expect(getCookie("test")).toBe("value");
		});

		it("handles special characters by encoding", () => {
			setCookie("test", "hello world");
			expect(getCookie("test")).toBe("hello world");
		});

		it("sets a cookie with max-age", () => {
			setCookie("test", "value", 3600);
			// Cookie is set - we verify by retrieving it
			expect(getCookie("test")).toBe("value");
		});

		it("does not throw when the document is undefined (SSR)", () => {
			const originalDocument = global.document;
			// @ts-expect-error - Testing undefined document for SSR
			global.document = undefined;
			expect(() => setCookie("test", "value")).not.toThrow();
			global.document = originalDocument;
		});
	});

	describe("deleteCookie", () => {
		it("deletes a cookie", () => {
			setCookie("toDelete", "value");
			expect(getCookie("toDelete")).toBe("value");
			deleteCookie("toDelete");
			expect(getCookie("toDelete")).toBeNull();
		});

		it("does not throw when deleting a non-existent cookie", () => {
			expect(() => deleteCookie("nonExistent")).not.toThrow();
		});
	});
});
