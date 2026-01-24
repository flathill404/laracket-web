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

	organizations: {
		all: () => ["organizations"] as const,
		list: (userId: string) => ["organizations", userId] as const,
		detail: (organizationId: string) =>
			["organizations", organizationId] as const,
		members: (organizationId: string) =>
			["organizations", organizationId, "members"] as const,
		projects: (organizationId: string) =>
			["organizations", organizationId, "projects"] as const,
		teams: (organizationId: string) =>
			["organizations", organizationId, "teams"] as const,
	},

	users: {
		tickets: (userId: string) => ["users", userId, "tickets"] as const,
	},
} as const;
