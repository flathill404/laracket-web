import type { z } from "zod";
import { client } from "@/lib/client";
import {
	type loginInputSchema,
	loginOutputSchema,
	userSchema,
} from "./schemas";

/**
 * Fetches the currently authenticated user.
 * @returns The authenticated user object.
 */
export const fetchUser = async () => {
	const response = await client.get("/user");
	const json = await response.json();
	return userSchema.parse(json.data);
};

/**
 * Logs in a user with email and password.
 * @param input - The login credentials.
 * @returns The login response containing 2FA status.
 */
export const login = async (input: z.infer<typeof loginInputSchema>) => {
	await client.get("/csrf-cookie");

	const response = await client.post("/login", input);
	const json = await response.json();
	return loginOutputSchema.parse(json);
};

/**
 * Logs out the current user.
 */
export const logout = async () => {
	await client.post("/logout");
};
