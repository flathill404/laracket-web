import { client } from "@/lib/client";
import {
	type ConfirmTwoFactorInput,
	type TwoFactorChallengeInput,
	twoFactorQrCodeSchema,
	twoFactorRecoveryCodesSchema,
} from "../types";

/**
 * Enables two-factor authentication for the user.
 */
export const enableTwoFactor = async () => {
	await client.post("/user/two-factor-authentication");
};

/**
 * Disables two-factor authentication for the user.
 */
export const disableTwoFactor = async () => {
	await client.delete("/user/two-factor-authentication");
};

/**
 * Fetches the QR code SVG for setting up two-factor authentication.
 * @returns The object containing the QR code SVG.
 */
export const fetchTwoFactorQrCode = async () => {
	const response = await client.get("/user/two-factor-qr-code");
	const json = await response.json();
	return twoFactorQrCodeSchema.parse(json);
};

/**
 * Fetches the recovery codes for two-factor authentication.
 * @returns An array of recovery codes.
 */
export const fetchTwoFactorRecoveryCodes = async () => {
	const response = await client.get("/user/two-factor-recovery-codes");
	const json = await response.json();
	return twoFactorRecoveryCodesSchema.parse(json);
};

/**
 * Confirms two-factor authentication with a code.
 * @param input - The confirmation code.
 */
export const confirmTwoFactor = async (input: ConfirmTwoFactorInput) => {
	await client.post("/user/confirmed-two-factor-authentication", input);
};

/**
 * Completes the two-factor authentication challenge during login.
 * @param input - The 2FA code or recovery code.
 */
export const twoFactorChallenge = async (input: TwoFactorChallengeInput) => {
	await client.post("/two-factor-challenge", input);
};
