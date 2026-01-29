import { HttpResponse, http } from "msw";
import {
	createProject,
	createProjectMember,
	createProjects,
} from "../fixtures/projects";
import { createPaginatedTickets, createTickets } from "../fixtures/tickets";

const BASE_URL = "http://localhost:8000/api";

export const projectHandlers = [
	// GET /users/:userId/projects
	http.get(`${BASE_URL}/users/:userId/projects`, () => {
		return HttpResponse.json({ data: createProjects(3) });
	}),

	// GET /projects/:projectId
	http.get(`${BASE_URL}/projects/:projectId`, ({ params }) => {
		return HttpResponse.json({
			data: createProject({ id: params.projectId as string }),
		});
	}),

	// POST /projects
	http.post(`${BASE_URL}/projects`, async ({ request }) => {
		const body = (await request.json()) as Record<string, unknown>;
		return HttpResponse.json({
			data: createProject({
				name: body.name as string,
				displayName: body.displayName as string,
				description: (body.description as string) ?? null,
			}),
		});
	}),

	// PUT /projects/:projectId
	http.put(`${BASE_URL}/projects/:projectId`, async ({ params, request }) => {
		const body = (await request.json()) as Record<string, unknown>;
		return HttpResponse.json({
			data: createProject({
				id: params.projectId as string,
				...body,
			}),
		});
	}),

	// DELETE /projects/:projectId
	http.delete(`${BASE_URL}/projects/:projectId`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// GET /projects/:projectId/members
	http.get(`${BASE_URL}/projects/:projectId/members`, () => {
		return HttpResponse.json({
			data: [
				createProjectMember({ id: "user-1" }),
				createProjectMember({ id: "user-2" }),
			],
		});
	}),

	// POST /projects/:projectId/members
	http.post(`${BASE_URL}/projects/:projectId/members`, async ({ request }) => {
		const body = (await request.json()) as { userId: string };
		return HttpResponse.json({
			data: createProjectMember({ id: body.userId }),
		});
	}),

	// DELETE /projects/:projectId/members/:userId
	http.delete(`${BASE_URL}/projects/:projectId/members/:userId`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// GET /projects/:projectId/tickets
	http.get(`${BASE_URL}/projects/:projectId/tickets`, () => {
		return HttpResponse.json(createPaginatedTickets(createTickets(5)));
	}),

	// POST /projects/:projectId/teams
	http.post(`${BASE_URL}/projects/:projectId/teams`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// DELETE /projects/:projectId/teams/:teamId
	http.delete(`${BASE_URL}/projects/:projectId/teams/:teamId`, () => {
		return new HttpResponse(null, { status: 200 });
	}),
];
