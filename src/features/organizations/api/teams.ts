import { z } from "zod";
import type { Team } from "@/features/teams/types";
import { teamSchema } from "@/features/teams/types/schemas";
import { client } from "@/lib/client";
import type { CreateOrganizationTeamInput } from "../types";

const organizationTeamsSchema = z.array(teamSchema);

export const fetchOrganizationTeams = async (
	organizationId: string,
): Promise<Team[]> => {
	const response = await client.get(`/organizations/${organizationId}/teams`);
	const json = await response.json();
	return organizationTeamsSchema.parse(json.data);
};

export const createOrganizationTeam = async (
	organizationId: string,
	input: CreateOrganizationTeamInput,
) => {
	const response = await client.post(
		`/organizations/${organizationId}/teams`,
		input,
	);
	const json = await response.json();
	return teamSchema.parse(json.data);
};
