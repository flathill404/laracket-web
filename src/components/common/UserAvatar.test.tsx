// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserAvatar } from "./UserAvatar";

vi.mock("@/components/ui/avatar", () => ({
	Avatar: ({
		children,
		className,
	}: {
		children: React.ReactNode;
		className?: string;
	}) => <div className={className}>{children}</div>,
	AvatarImage: ({ src, alt }: { src?: string; alt?: string }) =>
		src ? <img src={src} alt={alt} /> : null,
	AvatarFallback: ({ children }: { children: React.ReactNode }) => (
		<span>{children}</span>
	),
}));

describe("UserAvatar", () => {
	it("renders fallback initials", () => {
		render(<UserAvatar user={{ name: "John Doe" }} />);
		// Implementation slices first 2 chars of name, so "John Doe" -> "JO"
		expect(screen.getByText("JO")).toBeInTheDocument();
	});

	it("renders image if provided", () => {
		render(
			<UserAvatar
				user={{ name: "John Doe", avatarUrl: "http://example.com/avatar.jpg" }}
			/>,
		);
		const img = screen.getByRole("img");
		expect(img).toHaveAttribute("src", "http://example.com/avatar.jpg");
	});
});
