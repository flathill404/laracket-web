import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useRouteAwareAccordion } from "./useRouteAwareAccordion";

// Mock useLocation from @tanstack/react-router
const mocks = vi.hoisted(() => {
	return {
		useLocation: vi.fn(),
	};
});

vi.mock("@tanstack/react-router", () => {
	return {
		useLocation: mocks.useLocation,
	};
});

describe("useRouteAwareAccordion", () => {
	const mapping = {
		"/projects": "projects",
		"/teams": "teams",
		"/organizations": "organizations",
	};

	it("should return default value initially", () => {
		mocks.useLocation.mockReturnValue({ pathname: "/" });
		const { result } = renderHook(() =>
			useRouteAwareAccordion(mapping, ["default"]),
		);
		expect(result.current[0]).toEqual(["default"]);
	});

	it("should add section when path starts with keyword", () => {
		mocks.useLocation.mockReturnValue({ pathname: "/projects/123" });
		const { result } = renderHook(() => useRouteAwareAccordion(mapping));

		expect(result.current[0]).toContain("projects");
	});

	it("should NOT add section when path matches strictness but is nested (false positive check)", () => {
		// Example: /organizations/123/projects should NOT trigger 'projects' (which expects /projects)
		mocks.useLocation.mockReturnValue({
			pathname: "/organizations/123/projects",
		});
		const { result } = renderHook(() => useRouteAwareAccordion(mapping));

		expect(result.current[0]).toContain("organizations"); // Should match organizations
		expect(result.current[0]).not.toContain("projects"); // Should NOT match /projects prefix
	});

	it("should persist existing open sections", () => {
		mocks.useLocation.mockReturnValue({ pathname: "/projects" });
		const { result } = renderHook(() =>
			useRouteAwareAccordion(mapping, ["existing"]),
		);

		expect(result.current[0]).toEqual(
			expect.arrayContaining(["existing", "projects"]),
		);
	});

	it("should react to path updates", () => {
		mocks.useLocation.mockReturnValue({ pathname: "/" });
		const { result, rerender } = renderHook(() =>
			useRouteAwareAccordion(mapping),
		);

		expect(result.current[0]).toEqual([]);

		// Update path
		mocks.useLocation.mockReturnValue({ pathname: "/teams/456" });
		rerender();

		expect(result.current[0]).toContain("teams");
	});
});
