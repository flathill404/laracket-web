import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Team } from "@/features/teams/types";
import { render, screen } from "@/test/utils";
import { TeamsList } from "./TeamsList";

describe("TeamsList", () => {
	const mockTeams: Team[] = [
		{ id: "1", name: "team-1", displayName: "Team 1" } as Team,
		{ id: "2", name: "team-2", displayName: "Team 2" } as Team,
	];

	it("renders list of teams", () => {
		render(<TeamsList teams={mockTeams} onTeamClick={vi.fn()} />);

		expect(screen.getByText("Team 1")).toBeInTheDocument();
		expect(screen.getByText("@team-1")).toBeInTheDocument();
		expect(screen.getByText("Team 2")).toBeInTheDocument();
		expect(screen.getByText("@team-2")).toBeInTheDocument();
	});

	it("renders empty state when no teams", () => {
		render(<TeamsList teams={[]} onTeamClick={vi.fn()} />);

		expect(screen.getByText("No teams yet")).toBeInTheDocument();
		expect(
			screen.getByText("Create your first team to get started."),
		).toBeInTheDocument();
	});

	it("calls onTeamClick when card is clicked", async () => {
		const handleTeamClick = vi.fn();
		const user = userEvent.setup();
		render(<TeamsList teams={[mockTeams[0]]} onTeamClick={handleTeamClick} />);

		await user.click(screen.getByText("Team 1"));

		expect(handleTeamClick).toHaveBeenCalledWith(mockTeams[0]);
	});
});
