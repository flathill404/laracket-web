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
	it("should handle create organization", async () => {
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

	it("should handle update organization", async () => {
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

	it("should handle delete organization", async () => {
		const { result } = renderHook(() => useOrganizationActions());
		(deleteOrganization as Mock).mockResolvedValue({});

		result.current.delete.mutate("1");

		await waitFor(() => expect(result.current.delete.isSuccess).toBe(true));
		expect(deleteOrganization).toHaveBeenCalledWith("1", expect.anything());
	});
});
