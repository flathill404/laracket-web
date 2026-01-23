import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { client, request } from "./client";
import {
	ForbiddenError,
	NotFoundError,
	ServerError,
	UnauthorizedError,
	UnknownError,
} from "./errors";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Mock getCookie
vi.mock("../lib/cookie", () => ({
	getCookie: vi.fn(() => "mock-xsrf-token"),
}));

describe("HTTP client", () => {
	beforeEach(() => {
		mockFetch.mockClear();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("request function", () => {
		it("should make a GET request with correct headers", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
			});

			await request("GET", "/test");

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:8000/api/test",
				expect.objectContaining({
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						"Key-Inflection": "camel",
						"X-XSRF-TOKEN": "mock-xsrf-token",
					},
					credentials: "include",
					redirect: "manual",
				}),
			);
		});

		it("should make a POST request with body", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
			});

			const body = { name: "test", value: 123 };
			await request("POST", "/test", body);

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:8000/api/test",
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify(body),
				}),
			);
		});

		it("should make a PUT request with body", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
			});

			const body = { updated: true };
			await request("PUT", "/test/1", body);

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:8000/api/test/1",
				expect.objectContaining({
					method: "PUT",
					body: JSON.stringify(body),
				}),
			);
		});

		it("should make a PATCH request with body", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
			});

			const body = { partialUpdate: true };
			await request("PATCH", "/test/1", body);

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:8000/api/test/1",
				expect.objectContaining({
					method: "PATCH",
					body: JSON.stringify(body),
				}),
			);
		});

		it("should make a DELETE request without body", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				status: 200,
			});

			await request("DELETE", "/test/1");

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:8000/api/test/1",
				expect.objectContaining({
					method: "DELETE",
				}),
			);
		});

		it("should throw error if GET request has body", async () => {
			await expect(
				request("GET", "/test", { data: "invalid" }),
			).rejects.toThrow("GET and DELETE methods cannot have a body");
		});

		it("should throw error if DELETE request has body", async () => {
			await expect(
				request("DELETE", "/test", { data: "invalid" }),
			).rejects.toThrow("GET and DELETE methods cannot have a body");
		});

		it("should return response for successful request", async () => {
			const mockResponse = {
				ok: true,
				status: 200,
				json: () => Promise.resolve({ data: "test" }),
			};
			mockFetch.mockResolvedValueOnce(mockResponse);

			const result = await request("GET", "/test");

			expect(result).toBe(mockResponse);
		});
	});

	describe("error handling", () => {
		it("should throw UnauthorizedError for 401 response", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 401,
			});

			await expect(request("GET", "/test")).rejects.toThrow(UnauthorizedError);
		});

		it("should throw ForbiddenError for 403 response", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 403,
			});

			await expect(request("GET", "/test")).rejects.toThrow(ForbiddenError);
		});

		it("should throw NotFoundError for 404 response", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
			});

			await expect(request("GET", "/test")).rejects.toThrow(NotFoundError);
		});

		it("should throw ServerError for 500 response", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
			});

			await expect(request("GET", "/test")).rejects.toThrow(ServerError);
		});

		it("should throw UnknownError for other error responses", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 418, // I'm a teapot
			});

			await expect(request("GET", "/test")).rejects.toThrow(UnknownError);
		});

		it("should allow 302 redirects to pass through", async () => {
			const mockResponse = {
				ok: false,
				status: 302,
			};
			mockFetch.mockResolvedValueOnce(mockResponse);

			const result = await request("GET", "/test");

			expect(result).toBe(mockResponse);
		});
	});

	describe("client object", () => {
		it("should have get method that calls request with GET", async () => {
			mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

			await client.get("/users");

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:8000/api/users",
				expect.objectContaining({ method: "GET" }),
			);
		});

		it("should have post method that calls request with POST", async () => {
			mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

			const body = { name: "John" };
			await client.post("/users", body);

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:8000/api/users",
				expect.objectContaining({
					method: "POST",
					body: JSON.stringify(body),
				}),
			);
		});

		it("should have put method that calls request with PUT", async () => {
			mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

			const body = { name: "Updated" };
			await client.put("/users/1", body);

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:8000/api/users/1",
				expect.objectContaining({
					method: "PUT",
					body: JSON.stringify(body),
				}),
			);
		});

		it("should have patch method that calls request with PATCH", async () => {
			mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

			const body = { status: "active" };
			await client.patch("/users/1", body);

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:8000/api/users/1",
				expect.objectContaining({
					method: "PATCH",
					body: JSON.stringify(body),
				}),
			);
		});

		it("should have delete method that calls request with DELETE", async () => {
			mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

			await client.delete("/users/1");

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:8000/api/users/1",
				expect.objectContaining({ method: "DELETE" }),
			);
		});

		it("should allow post without body", async () => {
			mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

			await client.post("/logout");

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:8000/api/logout",
				expect.objectContaining({
					method: "POST",
				}),
			);
		});
	});
});
