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
				document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
			}
		}
		vi.restoreAllMocks();
	});

	describe("getCookie", () => {
		it("should return cookie value when cookie exists", () => {
			document.cookie = "testCookie=testValue";
			expect(getCookie("testCookie")).toBe("testValue");
		});

		it("should return null when cookie does not exist", () => {
			document.cookie = "otherCookie=otherValue";
			expect(getCookie("nonExistent")).toBeNull();
		});

		it("should handle multiple cookies", () => {
			document.cookie = "first=1";
			document.cookie = "second=2";
			document.cookie = "third=3";
			expect(getCookie("second")).toBe("2");
		});

		it("should decode URI-encoded values", () => {
			document.cookie = "encoded=hello%20world";
			expect(getCookie("encoded")).toBe("hello world");
		});

		it("should return null when document is undefined (SSR)", () => {
			const originalDocument = global.document;
			// @ts-expect-error - Testing undefined document for SSR
			global.document = undefined;
			expect(getCookie("test")).toBeNull();
			global.document = originalDocument;
		});
	});

	describe("setCookie", () => {
		it("should set a cookie and be retrievable", () => {
			setCookie("test", "value");
			expect(getCookie("test")).toBe("value");
		});

		it("should handle special characters by encoding", () => {
			setCookie("test", "hello world");
			expect(getCookie("test")).toBe("hello world");
		});

		it("should set cookie with max-age", () => {
			setCookie("test", "value", 3600);
			// Cookie is set - we verify by retrieving it
			expect(getCookie("test")).toBe("value");
		});

		it("should not throw when document is undefined (SSR)", () => {
			const originalDocument = global.document;
			// @ts-expect-error - Testing undefined document for SSR
			global.document = undefined;
			expect(() => setCookie("test", "value")).not.toThrow();
			global.document = originalDocument;
		});
	});

	describe("deleteCookie", () => {
		it("should delete a cookie", () => {
			setCookie("toDelete", "value");
			expect(getCookie("toDelete")).toBe("value");
			deleteCookie("toDelete");
			expect(getCookie("toDelete")).toBeNull();
		});

		it("should not throw when deleting non-existent cookie", () => {
			expect(() => deleteCookie("nonExistent")).not.toThrow();
		});
	});
});
