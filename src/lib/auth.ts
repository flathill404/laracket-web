import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";

import { client } from "@/lib/api/client";

const userSchema = z.object({
	id: z.string(),
	name: z.string(),
});

const fetchUser = async () => {
	const res = await client.get("/user");
	const user = await res.json();
	return userSchema.parse(user);
};

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
