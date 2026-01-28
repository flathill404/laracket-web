import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import { RocketMascot } from "./RocketMascot";

describe("RocketMascot", () => {
	it("renders successfully", () => {
		render(<RocketMascot />);
		expect(screen.getByTitle("Rocket Mascot")).toBeInTheDocument();
	});

	it("passes props to svg element", () => {
		render(<RocketMascot className="test-class" data-testid="rocket-mascot" />);
		const svg = screen.getByTestId("rocket-mascot");
		expect(svg).toHaveClass("test-class");
	});
});
