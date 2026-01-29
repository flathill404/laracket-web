import { HttpResponse, http } from "msw";
import {
	createActivity,
	createComment,
	createPaginatedTickets,
	createTicket,
	createTickets,
} from "../fixtures/tickets";

const BASE_URL = "http://localhost:8000/api";

export const ticketHandlers = [
	// GET /tickets/search (must be before :ticketId to avoid "search" being matched as ticketId)
	http.get(`${BASE_URL}/tickets/search`, () => {
		return HttpResponse.json(createPaginatedTickets(createTickets(5)));
	}),

	// GET /tickets/:ticketId
	http.get(`${BASE_URL}/tickets/:ticketId`, ({ params }) => {
		return HttpResponse.json({
			data: createTicket({ id: params.ticketId as string }),
		});
	}),

	// GET /users/:userId/tickets
	http.get(`${BASE_URL}/users/:userId/tickets`, () => {
		return HttpResponse.json({ data: createTickets(3) });
	}),

	// POST /tickets
	http.post(`${BASE_URL}/tickets`, async ({ request }) => {
		const body = (await request.json()) as Record<string, unknown>;
		return HttpResponse.json({
			data: createTicket({
				title: body.title as string,
				description: (body.description as string) ?? "",
				status: (body.status as "open") ?? "open",
			}),
		});
	}),

	// PUT /tickets/:ticketId
	http.put(`${BASE_URL}/tickets/:ticketId`, async ({ params, request }) => {
		const body = (await request.json()) as Record<string, unknown>;
		return HttpResponse.json({
			data: createTicket({
				id: params.ticketId as string,
				...body,
			}),
		});
	}),

	// PATCH /tickets/:ticketId/status
	http.patch(`${BASE_URL}/tickets/:ticketId/status`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// POST /tickets/:ticketId/assignees
	http.post(`${BASE_URL}/tickets/:ticketId/assignees`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// DELETE /tickets/:ticketId/assignees/:userId
	http.delete(`${BASE_URL}/tickets/:ticketId/assignees/:userId`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// POST /tickets/:ticketId/reviewers
	http.post(`${BASE_URL}/tickets/:ticketId/reviewers`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// DELETE /tickets/:ticketId/reviewers/:userId
	http.delete(`${BASE_URL}/tickets/:ticketId/reviewers/:userId`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// DELETE /tickets/:ticketId
	http.delete(`${BASE_URL}/tickets/:ticketId`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// PATCH /tickets/:ticketId/order
	http.patch(`${BASE_URL}/tickets/:ticketId/order`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// GET /tickets/:ticketId/comments
	http.get(`${BASE_URL}/tickets/:ticketId/comments`, () => {
		return HttpResponse.json({
			data: [
				createComment({ id: "comment-1" }),
				createComment({ id: "comment-2" }),
			],
		});
	}),

	// POST /tickets/:ticketId/comments
	http.post(`${BASE_URL}/tickets/:ticketId/comments`, async ({ request }) => {
		const body = (await request.json()) as { content: string };
		return HttpResponse.json({
			data: createComment({ content: body.content }),
		});
	}),

	// GET /tickets/:ticketId/activities
	http.get(`${BASE_URL}/tickets/:ticketId/activities`, () => {
		return HttpResponse.json({
			data: [
				createActivity({ id: 1 }),
				createActivity({ id: 2, type: "updated" }),
			],
		});
	}),
];
