export const queryKeys = {
	user: () => ["user"] as const,

	projects: {
		all: () => ["projects"] as const,
		list: (userId: string) => ["projects", userId] as const,
		detail: (projectId: string) => ["projects", projectId] as const,
		members: (projectId: string) => ["projects", projectId, "members"] as const,
		tickets: (projectId: string) => ["projects", projectId, "tickets"] as const,
	},

	tickets: {
		all: () => ["tickets"] as const,
		detail: (ticketId: string) => ["tickets", ticketId] as const,
		activities: (ticketId: string) =>
			["tickets", ticketId, "activities"] as const,
	},

	teams: {
		all: () => ["teams"] as const,
		list: (userId: string) => ["teams", userId] as const,
		detail: (teamId: string) => ["teams", teamId] as const,
		tickets: (teamId: string) => ["teams", teamId, "tickets"] as const,
	},

	users: {
		tickets: (userId: string) => ["users", userId, "tickets"] as const,
	},
} as const;
