// @vitest-environment jsdom
import { waitFor } from "@testing-library/react";
import { describe, expect, it, type Mock, vi } from "vitest";
import { renderHook } from "@/test/utils";

import {
	createOrganization,
	deleteOrganization,
	updateOrganization,
} from "../api";
import { useOrganizationActions } from "./useOrganizationActions";

vi.mock("../api", () => ({
	createOrganization: vi.fn(),
	updateOrganization: vi.fn(),
	deleteOrganization: vi.fn(),
}));

vi.mock("../utils/queries", () => ({
	organizationQueries: {
		list: () => ({ queryKey: ["organizations", "list"] }),
		detail: (id: string) => ({ queryKey: ["organizations", "detail", id] }),
	},
}));

describe("useOrganizationActions", () => {
	it("calls the API to create an organization", async () => {
		const { result } = renderHook(() => useOrganizationActions());
		(createOrganization as Mock).mockResolvedValue({});

		result.current.create.mutate({
			name: "New Org",
			displayName: "New Org Display",
		});

		await waitFor(() => expect(result.current.create.isSuccess).toBe(true));
		expect(createOrganization).toHaveBeenCalledWith(
			{
				name: "New Org",
				displayName: "New Org Display",
			},
			expect.anything(),
		);
	});

	it("calls the API to update an organization", async () => {
		const { result } = renderHook(() => useOrganizationActions());
		(updateOrganization as Mock).mockResolvedValue({});

		result.current.update.mutate({
			id: "1",
			data: { name: "Updated Org", displayName: "Updated Org Display" },
		});

		await waitFor(() => expect(result.current.update.isSuccess).toBe(true));
		expect(updateOrganization).toHaveBeenCalledWith("1", {
			name: "Updated Org",
			displayName: "Updated Org Display",
		});
	});

	it("calls the API to delete an organization", async () => {
		const { result } = renderHook(() => useOrganizationActions());
		(deleteOrganization as Mock).mockResolvedValue({});

		result.current.delete.mutate("1");

		await waitFor(() => expect(result.current.delete.isSuccess).toBe(true));
		expect(deleteOrganization).toHaveBeenCalledWith("1", expect.anything());
	});
});
