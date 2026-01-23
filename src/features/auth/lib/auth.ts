import { queryOptions } from "@tanstack/react-query";
import { UnauthorizedError } from "@/lib/errors";
import { fetchUser } from "../api";

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
