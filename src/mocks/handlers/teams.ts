import { HttpResponse, http } from "msw";
import { createTeam, createTeamMember, createTeams } from "../fixtures/teams";
import { createTickets } from "../fixtures/tickets";

const BASE_URL = "http://localhost:8000/api";

export const teamHandlers = [
	// GET /users/:userId/teams
	http.get(`${BASE_URL}/users/:userId/teams`, () => {
		return HttpResponse.json({ data: createTeams(3) });
	}),

	// GET /teams/:teamId
	http.get(`${BASE_URL}/teams/:teamId`, ({ params }) => {
		return HttpResponse.json({
			data: createTeam({ id: params.teamId as string }),
		});
	}),

	// POST /teams
	http.post(`${BASE_URL}/teams`, async ({ request }) => {
		const body = (await request.json()) as Record<string, unknown>;
		return HttpResponse.json({
			data: createTeam({
				name: body.name as string,
				displayName: body.displayName as string,
			}),
		});
	}),

	// PUT /teams/:teamId
	http.put(`${BASE_URL}/teams/:teamId`, async ({ params, request }) => {
		const body = (await request.json()) as Record<string, unknown>;
		return HttpResponse.json({
			data: createTeam({
				id: params.teamId as string,
				...body,
			}),
		});
	}),

	// DELETE /teams/:teamId
	http.delete(`${BASE_URL}/teams/:teamId`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// GET /teams/:teamId/members
	http.get(`${BASE_URL}/teams/:teamId/members`, () => {
		return HttpResponse.json({
			data: [
				createTeamMember({ id: "user-1", role: "leader" }),
				createTeamMember({ id: "user-2", role: "member" }),
			],
		});
	}),

	// POST /teams/:teamId/members
	http.post(`${BASE_URL}/teams/:teamId/members`, async ({ request }) => {
		const body = (await request.json()) as { userId: string };
		return HttpResponse.json({
			data: createTeamMember({ id: body.userId }),
		});
	}),

	// PATCH /teams/:teamId/members/:userId
	http.patch(
		`${BASE_URL}/teams/:teamId/members/:userId`,
		async ({ params, request }) => {
			const body = (await request.json()) as { role: "leader" | "member" };
			return HttpResponse.json({
				data: createTeamMember({
					id: params.userId as string,
					role: body.role,
				}),
			});
		},
	),

	// DELETE /teams/:teamId/members/:userId
	http.delete(`${BASE_URL}/teams/:teamId/members/:userId`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// GET /teams/:teamId/tickets
	http.get(`${BASE_URL}/teams/:teamId/tickets`, () => {
		return HttpResponse.json({ data: createTickets(3) });
	}),
];
