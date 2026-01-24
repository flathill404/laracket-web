import { client } from "@/lib/client";
import type {
	ConfirmPasswordInput,
	ForgotPasswordInput,
	ResetPasswordInput,
	UpdatePasswordInput,
} from "../types";

/**
 * Confirms the user's password.
 * @param input - The password to confirm.
 */
export const confirmPassword = async (input: ConfirmPasswordInput) => {
	await client.post("/user/confirm-password", input);
};

/**
 * Updates the user's password.
 * @param input - The current and new password.
 */
export const updatePassword = async (input: UpdatePasswordInput) => {
	await client.put("/user/password", input);
};

/**
 * Sends a password reset link to the user.
 * @param input - The email address.
 */
export const forgotPassword = async (input: ForgotPasswordInput) => {
	await client.post("/forgot-password", input);
};

/**
 * Resets the user's password.
 * @param input - The new password and token.
 */
export const resetPassword = async (input: ResetPasswordInput) => {
	await client.post("/reset-password", input);
};
