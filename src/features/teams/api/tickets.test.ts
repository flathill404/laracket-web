import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";

import { server } from "@/mocks/server";

import { fetchTeamTickets } from "./tickets";

const BASE_URL = "http://localhost:8000/api";

describe("tickets API", () => {
	describe("fetchTeamTickets", () => {
		it("should fetch team tickets", async () => {
			const result = await fetchTeamTickets("team-123");

			expect(result).toBeInstanceOf(Array);
			expect(result.length).toBeGreaterThan(0);
		});

		it("should return empty array when no tickets", async () => {
			server.use(
				http.get(`${BASE_URL}/teams/:teamId/tickets`, () => {
					return HttpResponse.json({ data: [] });
				}),
			);

			const result = await fetchTeamTickets("team-123");

			expect(result).toEqual([]);
		});
	});
});
