import { queryOptions } from "@tanstack/react-query";

import { fetchUser } from "./api/auth";

export const userQueryOptions = queryOptions({
	queryKey: ["user"],
	queryFn: async () => {
		try {
			return await fetchUser();
		} catch (e) {
			console.debug(e);
			return null;
		}
	},
	staleTime: Infinity,
});
