import type { z } from "zod";
import { client } from "@/lib/client";
import type {
	confirmPasswordInputSchema,
	forgotPasswordInputSchema,
	resetPasswordInputSchema,
	updatePasswordInputSchema,
} from "./schemas";

/**
 * Confirms the user's password.
 * @param input - The password to confirm.
 */
export const confirmPassword = async (
	input: z.infer<typeof confirmPasswordInputSchema>,
) => {
	await client.post("/user/confirm-password", input);
};

/**
 * Updates the user's password.
 * @param input - The current and new password.
 */
export const updatePassword = async (
	input: z.infer<typeof updatePasswordInputSchema>,
) => {
	await client.put("/user/password", input);
};

/**
 * Sends a password reset link to the user.
 * @param input - The email address.
 */
export const forgotPassword = async (
	input: z.infer<typeof forgotPasswordInputSchema>,
) => {
	await client.post("/forgot-password", input);
};

/**
 * Resets the user's password.
 * @param input - The new password and token.
 */
export const resetPassword = async (
	input: z.infer<typeof resetPasswordInputSchema>,
) => {
	await client.post("/reset-password", input);
};
