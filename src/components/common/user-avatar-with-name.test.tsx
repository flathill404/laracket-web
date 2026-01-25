import { describe, expect, it } from "vitest";
import { render, screen } from "@/test/utils";
import { UserAvatarWithName } from "./user-avatar-with-name";

describe("UserAvatarWithName", () => {
	const user = {
		id: "1",
		name: "John Doe",
		email: "john@example.com",
		avatarUrl: "https://example.com/avatar.jpg",
	};

	it("renders user name", () => {
		render(<UserAvatarWithName user={user} />);
		expect(screen.getByText("John Doe")).toBeInTheDocument();
	});

	it("renders display name if available", () => {
		const userWithDisplay = {
			...user,
			displayName: "Johnny",
		};
		render(<UserAvatarWithName user={userWithDisplay} />);
		expect(screen.getByText("Johnny")).toBeInTheDocument();
	});

	it("renders secondary name when enabled", () => {
		const userWithDisplay = {
			...user,
			displayName: "Johnny",
		};
		// Secondary name defaults to user.name if not provided explicitly but enabled
		render(<UserAvatarWithName user={userWithDisplay} showSecondaryName />);
		expect(screen.getByText("John Doe")).toBeInTheDocument();
	});

	it("renders explicit secondary name", () => {
		render(
			<UserAvatarWithName
				user={user}
				showSecondaryName
				secondaryName="Custom Secondary"
			/>,
		);
		expect(screen.getByText("Custom Secondary")).toBeInTheDocument();
	});
});
