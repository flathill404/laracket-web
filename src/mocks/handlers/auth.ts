import { HttpResponse, http } from "msw";
import { createUser } from "../fixtures/auth";

const BASE_URL = "http://localhost:8000/api";

export const authHandlers = [
	// GET /csrf-cookie
	http.get(`${BASE_URL}/csrf-cookie`, () => {
		return new HttpResponse(null, { status: 204 });
	}),

	// GET /user
	http.get(`${BASE_URL}/user`, () => {
		return HttpResponse.json({ data: createUser() });
	}),

	// POST /login
	http.post(`${BASE_URL}/login`, () => {
		return HttpResponse.json({ twoFactor: false });
	}),

	// POST /logout
	http.post(`${BASE_URL}/logout`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// POST /register
	http.post(`${BASE_URL}/register`, () => {
		return new HttpResponse(null, { status: 201 });
	}),

	// POST /email/verification-notification
	http.post(`${BASE_URL}/email/verification-notification`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// POST /user/confirm-password
	http.post(`${BASE_URL}/user/confirm-password`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// PUT /user/password
	http.put(`${BASE_URL}/user/password`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// POST /forgot-password
	http.post(`${BASE_URL}/forgot-password`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// POST /reset-password
	http.post(`${BASE_URL}/reset-password`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// POST /user/two-factor-authentication
	http.post(`${BASE_URL}/user/two-factor-authentication`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// DELETE /user/two-factor-authentication
	http.delete(`${BASE_URL}/user/two-factor-authentication`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// GET /user/two-factor-qr-code
	http.get(`${BASE_URL}/user/two-factor-qr-code`, () => {
		return HttpResponse.json({ svg: "<svg>mock-qr-code</svg>" });
	}),

	// GET /user/two-factor-recovery-codes
	http.get(`${BASE_URL}/user/two-factor-recovery-codes`, () => {
		return HttpResponse.json([
			"recovery-code-1",
			"recovery-code-2",
			"recovery-code-3",
			"recovery-code-4",
			"recovery-code-5",
			"recovery-code-6",
			"recovery-code-7",
			"recovery-code-8",
		]);
	}),

	// POST /user/confirmed-two-factor-authentication
	http.post(`${BASE_URL}/user/confirmed-two-factor-authentication`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// POST /two-factor-challenge
	http.post(`${BASE_URL}/two-factor-challenge`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// PUT /user/profile-information
	http.put(`${BASE_URL}/user/profile-information`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// POST /user/avatar
	http.post(`${BASE_URL}/user/avatar`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// DELETE /user/avatar
	http.delete(`${BASE_URL}/user/avatar`, () => {
		return new HttpResponse(null, { status: 200 });
	}),
];
