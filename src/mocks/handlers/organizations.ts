import { HttpResponse, http } from "msw";
import {
	createOrganization,
	createOrganizationMember,
	createOrganizations,
} from "../fixtures/organizations";
import { createProject, createProjects } from "../fixtures/projects";
import { createTeam, createTeams } from "../fixtures/teams";

const BASE_URL = "http://localhost:8000/api";

export const organizationHandlers = [
	// GET /organizations
	http.get(`${BASE_URL}/organizations`, () => {
		return HttpResponse.json({ data: createOrganizations(3) });
	}),

	// GET /organizations/:organizationId
	http.get(`${BASE_URL}/organizations/:organizationId`, ({ params }) => {
		return HttpResponse.json({
			data: createOrganization({ id: params.organizationId as string }),
		});
	}),

	// POST /organizations
	http.post(`${BASE_URL}/organizations`, async ({ request }) => {
		const body = (await request.json()) as Record<string, unknown>;
		return HttpResponse.json({
			data: createOrganization({
				name: body.name as string,
				displayName: body.displayName as string,
			}),
		});
	}),

	// PUT /organizations/:organizationId
	http.put(
		`${BASE_URL}/organizations/:organizationId`,
		async ({ params, request }) => {
			const body = (await request.json()) as Record<string, unknown>;
			return HttpResponse.json({
				data: createOrganization({
					id: params.organizationId as string,
					...body,
				}),
			});
		},
	),

	// DELETE /organizations/:organizationId
	http.delete(`${BASE_URL}/organizations/:organizationId`, () => {
		return new HttpResponse(null, { status: 200 });
	}),

	// GET /organizations/:organizationId/members
	http.get(`${BASE_URL}/organizations/:organizationId/members`, () => {
		return HttpResponse.json({
			data: [
				createOrganizationMember({ id: "user-1", role: "owner" }),
				createOrganizationMember({ id: "user-2", role: "member" }),
			],
		});
	}),

	// POST /organizations/:organizationId/members
	http.post(
		`${BASE_URL}/organizations/:organizationId/members`,
		async ({ request }) => {
			const body = (await request.json()) as { userId: string };
			return HttpResponse.json({
				data: createOrganizationMember({ id: body.userId }),
			});
		},
	),

	// PATCH /organizations/:organizationId/members/:userId
	http.patch(
		`${BASE_URL}/organizations/:organizationId/members/:userId`,
		async ({ params, request }) => {
			const body = (await request.json()) as {
				role: "owner" | "admin" | "member";
			};
			return HttpResponse.json({
				data: createOrganizationMember({
					id: params.userId as string,
					role: body.role,
				}),
			});
		},
	),

	// DELETE /organizations/:organizationId/members/:userId
	http.delete(
		`${BASE_URL}/organizations/:organizationId/members/:userId`,
		() => {
			return new HttpResponse(null, { status: 200 });
		},
	),

	// GET /organizations/:organizationId/projects
	http.get(`${BASE_URL}/organizations/:organizationId/projects`, () => {
		return HttpResponse.json({ data: createProjects(3) });
	}),

	// POST /organizations/:organizationId/projects
	http.post(
		`${BASE_URL}/organizations/:organizationId/projects`,
		async ({ request }) => {
			const body = (await request.json()) as Record<string, unknown>;
			return HttpResponse.json({
				data: createProject({
					name: body.name as string,
					displayName: body.displayName as string,
					description: (body.description as string) ?? null,
				}),
			});
		},
	),

	// GET /organizations/:organizationId/teams
	http.get(`${BASE_URL}/organizations/:organizationId/teams`, () => {
		return HttpResponse.json({ data: createTeams(3) });
	}),

	// POST /organizations/:organizationId/teams
	http.post(
		`${BASE_URL}/organizations/:organizationId/teams`,
		async ({ request }) => {
			const body = (await request.json()) as Record<string, unknown>;
			return HttpResponse.json({
				data: createTeam({
					name: body.name as string,
					displayName: body.displayName as string,
				}),
			});
		},
	),
];
