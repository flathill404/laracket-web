// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { UserAvatar, UserAvatarStack } from "./user-avatar";

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

describe("UserAvatarStack", () => {
	it("renders max avatars and remainder", () => {
		const users = [
			{ id: "1", name: "A" },
			{ id: "2", name: "B" },
			{ id: "3", name: "C" },
			{ id: "4", name: "D" },
		];
		render(<UserAvatarStack users={users} max={2} />);

		// Should show A, B and +2
		expect(screen.getByText("A")).toBeInTheDocument();
		expect(screen.getByText("B")).toBeInTheDocument();
		expect(screen.getByText("+2")).toBeInTheDocument();
		expect(screen.queryByText("C")).not.toBeInTheDocument();
	});
});
