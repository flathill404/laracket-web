import { z } from "zod";

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	displayName: z.string().nullish(),
	email: z.email(),
	emailVerifiedAt: z.string().nullish(),
	avatarUrl: z.string().nullish(),
	twoFactorStatus: z.enum(["disabled", "pending", "enabled"]),
});

export const loginInputSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
	remember: z.boolean().default(false),
});

export const loginOutputSchema = z.object({
	twoFactor: z.boolean(),
});

export const registerInputSchema = z.object({
	name: z.string().min(1),
	displayName: z.string().min(1),
	email: z.email(),
	password: z.string().min(8),
	passwordConfirmation: z.string().min(8),
});

export const updateProfileInformationInputSchema = z.object({
	displayName: z.string(),
	email: z.email(),
});

export const confirmPasswordInputSchema = z.object({
	password: z.string(),
});

export const updatePasswordInputSchema = z.object({
	currentPassword: z.string(),
	password: z.string().min(8),
	passwordConfirmation: z.string().min(8),
});

export const twoFactorQrCodeSchema = z.object({
	svg: z.string(),
});

export const twoFactorRecoveryCodesSchema = z.array(z.string());

export const confirmTwoFactorInputSchema = z.object({
	code: z.string(),
});

export const twoFactorChallengeInputSchema = z.object({
	code: z.string().optional(),
	recoveryCode: z.string().optional(),
});

export const forgotPasswordInputSchema = z.object({
	email: z.email(),
});

export const resetPasswordInputSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
	passwordConfirmation: z.string().min(8),
	token: z.string(),
});
