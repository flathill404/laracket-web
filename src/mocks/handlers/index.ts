import { authHandlers } from "./auth";
import { organizationHandlers } from "./organizations";
import { projectHandlers } from "./projects";
import { teamHandlers } from "./teams";
import { ticketHandlers } from "./tickets";

export const handlers = [
	...authHandlers,
	...ticketHandlers,
	...projectHandlers,
	...organizationHandlers,
	...teamHandlers,
];
