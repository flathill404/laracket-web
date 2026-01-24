import type { z } from "zod";
import { client } from "@/lib/client";
import type { registerInputSchema } from "../types";

/**
 * Registers a new user.
 * @param input - The registration details.
 */
export const register = async (input: z.infer<typeof registerInputSchema>) => {
	await client.get("/csrf-cookie");
	await client.post("/register", input);
};

/**
 * Sends a new verification email to the user.
 */
export const sendVerificationEmail = async () => {
	await client.post("/email/verification-notification");
};
