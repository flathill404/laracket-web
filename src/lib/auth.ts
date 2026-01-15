import { queryOptions } from "@tanstack/react-query";

import { fetchUser } from "./api/auth";
import { UnauthorizedError } from "./api/errors";

export const userQueryOptions = queryOptions({
	queryKey: ["user"],
	queryFn: async () => {
		try {
			return await fetchUser();
		} catch (e) {
			// UnauthorizedError is expected
			if (e instanceof UnauthorizedError) {
				return null;
			}
			throw e;
		}
	},
	staleTime: Infinity,
});
