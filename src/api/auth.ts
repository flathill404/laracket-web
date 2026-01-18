import { z } from "zod";
import { client } from "@/api/client";
import { getCookie } from "@/lib/cookie";

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string().nullable().optional(), // Added displayName
	email: z.email(),
	avatarUrl: z.string().optional(),
	twoFactorConfirmedAt: z.string().nullable().optional(),
});

/**
 * Fetches the currently authenticated user.
 * @returns The authenticated user object.
 */
const fetchUser = async () => {
	const response = await client.get("/user");
	const json = await response.json();
	return userSchema.parse(json.data);
};

const loginInputSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	remember: z.boolean().default(false),
});

const loginOutputSchema = z.object({
	two_factor: z.boolean(),
});

/**
 * Logs in a user with email and password.
 * @param input - The login credentials.
 * @returns The login response containing 2FA status.
 */
const login = async (input: z.infer<typeof loginInputSchema>) => {
	await client.get("/csrf-cookie");

	const response = await client.post("/login", input);
	const json = await response.json();
	return loginOutputSchema.parse(json);
};

/**
 * Logs out the current user.
 */
const logout = async () => {
	await client.post("/logout");
};

const updateProfileInformationInputSchema = z.object({
	// name: z.string(), // Removed name as it is fixed
	displayName: z.string(),
	email: z.string().email(),
});

/**
 * Updates the user's profile information.
 * @param input - The name and email.
 */
const updateProfileInformation = async (
	input: z.infer<typeof updateProfileInformationInputSchema>,
) => {
	await client.put("/user/profile-information", input);
};

const updatePasswordInputSchema = z.object({
	current_password: z.string(),
	password: z.string().min(8),
	password_confirmation: z.string().min(8),
});

/**
 * Updates the user's password.
 * @param input - The current and new password.
 */
const updatePassword = async (
	input: z.infer<typeof updatePasswordInputSchema>,
) => {
	await client.put("/user/password", input);
};

/**
 * Updates the user's avatar.
 * @param file - The new avatar file.
 */
const updateAvatar = async (file: File) => {
	const formData = new FormData();
	formData.append("avatar", file);

	// We use global fetch to support FormData and avoid JSON stringification from client.post
	const BASE_URL = "http://localhost:8000/api";
	const csrfToken = getCookie("XSRF-TOKEN") || "";

	await fetch(`${BASE_URL}/user/avatar`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Key-Inflection": "camel",
			"X-XSRF-TOKEN": csrfToken,
		},
		body: formData,
		credentials: "include",
	});
};

/**
 * Deletes the user's avatar.
 */
const deleteAvatar = async () => {
	// User said "avatar" for "profile-photo".
	await client.delete("/user/avatar");
};

/**
 * Enables two-factor authentication for the user.
 */
const enableTwoFactor = async () => {
	await client.post("/user/two-factor-authentication");
};

/**
 * Disables two-factor authentication for the user.
 */
const disableTwoFactor = async () => {
	await client.delete("/user/two-factor-authentication");
};

const twoFactorQrCodeSchema = z.object({
	svg: z.string(),
});

/**
 * Fetches the QR code SVG for setting up two-factor authentication.
 * @returns The object containing the QR code SVG.
 */
const fetchTwoFactorQrCode = async () => {
	const response = await client.get("/user/two-factor-qr-code");
	const json = await response.json();
	return twoFactorQrCodeSchema.parse(json);
};

const twoFactorRecoveryCodesSchema = z.array(z.string());

/**
 * Fetches the recovery codes for two-factor authentication.
 * @returns An array of recovery codes.
 */
const fetchTwoFactorRecoveryCodes = async () => {
	const response = await client.get("/user/two-factor-recovery-codes");
	const json = await response.json();
	return twoFactorRecoveryCodesSchema.parse(json);
};

const confirmTwoFactorInputSchema = z.object({
	code: z.string(),
});

/**
 * Confirms two-factor authentication with a code.
 * @param input - The confirmation code.
 */
const confirmTwoFactor = async (
	input: z.infer<typeof confirmTwoFactorInputSchema>,
) => {
	await client.post("/user/confirmed-two-factor-authentication", input);
};

const twoFactorChallengeInputSchema = z.object({
	code: z.string().optional(),
	recovery_code: z.string().optional(),
});

/**
 * Completes the two-factor authentication challenge during login.
 * @param input - The 2FA code or recovery code.
 */
const twoFactorChallenge = async (
	input: z.infer<typeof twoFactorChallengeInputSchema>,
) => {
	await client.post("/two-factor-challenge", input);
};

export {
	fetchUser,
	login,
	logout,
	updateProfileInformation,
	updatePassword,
	updateAvatar,
	deleteAvatar,
	// 2FA functions
	enableTwoFactor,
	disableTwoFactor,
	fetchTwoFactorQrCode,
	fetchTwoFactorRecoveryCodes,
	confirmTwoFactor,
	twoFactorChallenge,
};
