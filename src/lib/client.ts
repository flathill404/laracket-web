import { getCookie } from "../lib/cookie";
import {
	ForbiddenError,
	NotFoundError,
	ServerError,
	UnauthorizedError,
	UnknownError,
} from "./errors";

async function checkGeneralResponse(response: Response) {
	if (response.ok) {
		return;
	}

	// Allow 302 redirects to pass through (handled by redirect: "manual")
	if (response.status === 302) {
		return;
	}

	if (response.status === 401) {
		throw new UnauthorizedError();
	}

	if (response.status === 403) {
		throw new ForbiddenError();
	}

	if (response.status === 404) {
		throw new NotFoundError();
	}

	if (response.status === 500) {
		throw new ServerError();
	}

	throw new UnknownError();
}

const BASE_URL = "http://localhost:8000/api";

export async function request(
	method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
	endpoint: string,
	body?: unknown,
): Promise<Response> {
	if (!method) {
		throw new Error("Method is required");
	}

	if ((method === "GET" || method === "DELETE") && body) {
		throw new Error("GET and DELETE methods cannot have a body");
	}

	const defaultHeaders = {
		"Content-Type": "application/json",
		Accept: "application/json",
		"Key-Inflection": "camel",
		"X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || "",
	};

	const config: RequestInit = {
		method,
		headers: defaultHeaders,
		credentials: "include",
		redirect: "manual",
	};

	if (body) {
		config.body = JSON.stringify(body);
	}

	const response = await fetch(`${BASE_URL}${endpoint}`, config);

	await checkGeneralResponse(response);

	return response;
}

export const client = {
	get: (endpoint: string) => request("GET", endpoint),
	delete: (endpoint: string) => request("DELETE", endpoint),
	post: (endpoint: string, body?: unknown) => request("POST", endpoint, body),
	put: (endpoint: string, body?: unknown) => request("PUT", endpoint, body),
	patch: (endpoint: string, body?: unknown) => request("PATCH", endpoint, body),
};
