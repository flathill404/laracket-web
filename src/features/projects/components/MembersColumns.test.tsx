import {
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Table, TableBody, TableRow } from "@/components/ui/table";
import type { ProjectMember } from "../types";
import { columns } from "./MembersColumns";

// Mock UserAvatarWithName to avoid complex rendering
vi.mock("@/components/common/UserAvatarWithName", () => ({
	UserAvatarWithName: ({ user }: { user: ProjectMember }) => (
		<div>
			{user.displayName} ({user.name})
		</div>
	),
}));

// Helper component to render columns in isolation
const TestTable = ({ data }: { data: ProjectMember[] }) => {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Table>
			<TableBody>
				{table.getRowModel().rows.map((row) => (
					<TableRow key={row.id}>
						{row.getVisibleCells().map((cell) => (
							<td key={cell.id}>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};

describe("MembersColumns", () => {
	const mockUser = {
		id: "1",
		name: "testuser",
		displayName: "Test User",
		avatarUrl: null,
	};

	it("renders user name and avatar", () => {
		render(<TestTable data={[mockUser]} />);
		expect(screen.getByText(/Test User/)).toBeInTheDocument();
		expect(screen.getByText(/testuser/)).toBeInTheDocument();
	});

	it("renders role as Member", () => {
		render(<TestTable data={[mockUser]} />);
		expect(screen.getByText("Member")).toBeInTheDocument();
	});

	it("renders correct assignment badge based on ID logic", () => {
		// ID '1' charCode is 49 (odd) -> "Via Team" (outline)
		render(<TestTable data={[{ ...mockUser, id: "1" }]} />);
		expect(screen.getByText("Via Team")).toBeInTheDocument();

		// ID '2' charCode is 50 (even) -> "Direct" (secondary)
		render(<TestTable data={[{ ...mockUser, id: "2" }]} />);
		expect(screen.getByText("Direct")).toBeInTheDocument();
	});

	it("renders actions menu", () => {
		render(<TestTable data={[mockUser]} />);
		expect(
			screen.getByRole("button", { name: /open menu/i }),
		).toBeInTheDocument();
	});
});
