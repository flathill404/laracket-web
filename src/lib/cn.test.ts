import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
	it("merges class names", () => {
		expect(cn("foo", "bar")).toBe("foo bar");
	});

	it("handles conditional classes with clsx", () => {
		expect(cn("base", { active: true, disabled: false })).toBe("base active");
	});

	it("handles arrays", () => {
		expect(cn(["foo", "bar"])).toBe("foo bar");
	});

	it("handles undefined and null", () => {
		expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
	});

	it("merges Tailwind classes correctly", () => {
		expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
	});

	it("handles conflicting Tailwind classes", () => {
		expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
	});

	it("handles empty input", () => {
		expect(cn()).toBe("");
	});

	it("handles complex Tailwind merges", () => {
		expect(cn("bg-red-500 hover:bg-red-600", "bg-blue-500")).toBe(
			"hover:bg-red-600 bg-blue-500",
		);
	});
});
