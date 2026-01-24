import { client } from "@/lib/client";
import type { RegisterInput } from "../types";

/**
 * Registers a new user.
 * @param input - The registration details.
 */
export const register = async (input: RegisterInput) => {
	await client.get("/csrf-cookie");
	await client.post("/register", input);
};

/**
 * Sends a new verification email to the user.
 */
export const sendVerificationEmail = async () => {
	await client.post("/email/verification-notification");
};
