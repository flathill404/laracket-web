import { HttpResponse, http } from "msw";
import { zocker } from "zocker";
import { z } from "zod";
import { userSchema } from "@/features/auth/api/auth";
import { projectSchema } from "@/features/projects/api/projects";
import { teamSchema } from "@/features/teams/api/teams";
import { ticketSchema, ticketsSchema } from "@/features/tickets/api/tickets";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const handlers = [
	// Auth
	http.get(`${BASE_URL}/up`, () => {
		return HttpResponse.json({ status: "ok", mocked: true });
	}),
	http.get(`${BASE_URL}/user`, () => {
		const mockUser = zocker(userSchema).generate();
		return HttpResponse.json({ data: mockUser });
	}),

	// Projects
	http.get(`${BASE_URL}/users/:userId/projects`, () => {
		const mockProjects = zocker(z.array(projectSchema)).generate();
		return HttpResponse.json({ data: mockProjects });
	}),
	http.get(`${BASE_URL}/projects/:projectId`, () => {
		const mockProject = zocker(projectSchema).generate();
		return HttpResponse.json({ data: mockProject });
	}),
	http.get(`${BASE_URL}/projects/:projectId/tickets`, () => {
		const mockTickets = zocker(ticketsSchema).generate();
		return HttpResponse.json({ data: mockTickets });
	}),

	// Teams
	http.get(`${BASE_URL}/users/:userId/teams`, () => {
		const mockTeams = zocker(z.array(teamSchema)).generate();
		return HttpResponse.json({ data: mockTeams });
	}),
	http.get(`${BASE_URL}/teams/:teamId`, () => {
		const mockTeam = zocker(teamSchema).generate();
		return HttpResponse.json({ data: mockTeam });
	}),
	http.get(`${BASE_URL}/teams/:teamId/tickets`, () => {
		const mockTickets = zocker(ticketsSchema).generate();
		return HttpResponse.json({ data: mockTickets });
	}),

	// Tickets
	http.get(`${BASE_URL}/tickets/:ticketId`, () => {
		const mockTicket = zocker(ticketSchema).generate();
		return HttpResponse.json({ data: mockTicket });
	}),
	http.get(`${BASE_URL}/users/:userId/tickets`, () => {
		const mockTickets = zocker(ticketsSchema).generate();
		return HttpResponse.json({ data: mockTickets });
	}),
];
