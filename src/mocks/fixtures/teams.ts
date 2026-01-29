import type { Team, TeamMember } from "@/features/teams/types";

export const createTeam = (overrides?: Partial<Team>): Team => ({
	id: "team-123",
	name: "test-team",
	displayName: "Test Team",
	...overrides,
});

export const createTeams = (count: number): Team[] =>
	Array.from({ length: count }, (_, i) =>
		createTeam({
			id: `team-${i + 1}`,
			name: `test-team-${i + 1}`,
			displayName: `Test Team ${i + 1}`,
		}),
	);

export const createTeamMember = (
	overrides?: Partial<TeamMember>,
): TeamMember => ({
	id: "user-123",
	name: "john_doe",
	displayName: "John Doe",
	avatarUrl: null,
	role: "member",
	...overrides,
});
