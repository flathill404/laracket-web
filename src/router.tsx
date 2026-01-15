import { createRouter } from "@tanstack/react-router";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
	const queryContext = TanstackQuery.getContext();

	const router = createRouter({
		routeTree,
		context: {
			...queryContext,
			auth: {
				isAuthenticated: false,
				isLoading: false,
			},
		},

		defaultPreload: "intent",
	});

	return router;
};
