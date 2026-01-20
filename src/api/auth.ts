import { z } from "zod";
import { client } from "@/api/client";

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string().nullish(),
	email: z.email(),
	emailVerifiedAt: z.string().nullish(),
	avatarUrl: z.string().nullish(),
	twoFactorConfirmedAt: z.string().nullish(),
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
	email: z.email(),
	password: z.string().min(8),
	remember: z.boolean().default(false),
});

const loginOutputSchema = z.object({
	twoFactor: z.boolean(),
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
	displayName: z.string(),
	email: z.email(),
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

const confirmPasswordInputSchema = z.object({
	password: z.string(),
});

/**
 * Confirms the user's password.
 * @param input - The password to confirm.
 */
const confirmPassword = async (
	input: z.infer<typeof confirmPasswordInputSchema>,
) => {
	await client.post("/user/confirm-password", input);
};

const updatePasswordInputSchema = z.object({
	currentPassword: z.string(),
	password: z.string().min(8),
	passwordConfirmation: z.string().min(8),
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
	const avatar = await new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});

	await client.post("/user/avatar", { avatar });
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
	recoveryCode: z.string().optional(),
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

/**
 * Sends a new verification email to the user.
 */
const sendVerificationEmail = async () => {
	await client.post("/email/verification-notification");
};

export {
	fetchUser,
	login,
	logout,
	updateProfileInformation,
	updatePassword,
	confirmPassword,
	updateAvatar,
	deleteAvatar,
	// 2FA functions
	enableTwoFactor,
	disableTwoFactor,
	fetchTwoFactorQrCode,
	fetchTwoFactorRecoveryCodes,
	confirmTwoFactor,
	twoFactorChallenge,
	sendVerificationEmail,
};
