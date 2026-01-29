import type { User } from "@/features/auth/types";

export const createUser = (overrides?: Partial<User>): User => ({
	id: "user-123",
	name: "john_doe",
	displayName: "John Doe",
	email: "john@example.com",
	emailVerifiedAt: "2024-01-01T00:00:00Z",
	avatarUrl: "https://example.com/avatar.jpg",
	twoFactorStatus: "disabled",
	...overrides,
});

export const createTicketUser = (
	overrides?: Partial<{
		id: string;
		name: string;
		displayName: string;
		avatarUrl: string | null;
	}>,
) => ({
	id: "user-123",
	name: "john_doe",
	displayName: "John Doe",
	avatarUrl: null,
	...overrides,
});
