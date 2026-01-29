import {
	afterAll,
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";

import { server } from "@/mocks/server";

import { client, request } from "./client";
import {
	ForbiddenError,
	NotFoundError,
	ServerError,
	UnauthorizedError,
	UnknownError,
} from "./errors";

// Disable MSW for these tests since we're testing low-level HTTP client behavior
beforeAll(() => {
	server.close();
});

afterAll(() => {
	server.listen({ onUnhandledRequest: "error" });
});

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
		it("makes a GET request with correct headers", async () => {
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

		it("makes a POST request with a body", async () => {
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

		it("makes a PUT request with a body", async () => {
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

		it("makes a PATCH request with a body", async () => {
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

		it("makes a DELETE request without a body", async () => {
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

		it("throws an error if a GET request has a body", async () => {
			await expect(
				request("GET", "/test", { data: "invalid" }),
			).rejects.toThrow("GET and DELETE methods cannot have a body");
		});

		it("throws an error if a DELETE request has a body", async () => {
			await expect(
				request("DELETE", "/test", { data: "invalid" }),
			).rejects.toThrow("GET and DELETE methods cannot have a body");
		});

		it("returns a response for a successful request", async () => {
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
		it("throws an UnauthorizedError for a 401 response", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 401,
			});

			await expect(request("GET", "/test")).rejects.toThrow(UnauthorizedError);
		});

		it("throws a ForbiddenError for a 403 response", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 403,
			});

			await expect(request("GET", "/test")).rejects.toThrow(ForbiddenError);
		});

		it("throws a NotFoundError for a 404 response", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 404,
			});

			await expect(request("GET", "/test")).rejects.toThrow(NotFoundError);
		});

		it("throws a ServerError for a 500 response", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 500,
			});

			await expect(request("GET", "/test")).rejects.toThrow(ServerError);
		});

		it("throws an UnknownError for other error responses", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: false,
				status: 418, // I'm a teapot
			});

			await expect(request("GET", "/test")).rejects.toThrow(UnknownError);
		});

		it("allows 302 redirects to pass through", async () => {
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
		it("has a get method that calls request with GET", async () => {
			mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

			await client.get("/users");

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:8000/api/users",
				expect.objectContaining({ method: "GET" }),
			);
		});

		it("has a post method that calls request with POST", async () => {
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

		it("has a put method that calls request with PUT", async () => {
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

		it("has a patch method that calls request with PATCH", async () => {
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

		it("has a delete method that calls request with DELETE", async () => {
			mockFetch.mockResolvedValueOnce({ ok: true, status: 200 });

			await client.delete("/users/1");

			expect(mockFetch).toHaveBeenCalledWith(
				"http://localhost:8000/api/users/1",
				expect.objectContaining({ method: "DELETE" }),
			);
		});

		it("allows post without a body", async () => {
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
