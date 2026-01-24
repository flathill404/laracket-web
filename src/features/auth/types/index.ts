import type { z } from "zod";
import type * as schemas from "./schemas";

export type User = z.infer<typeof schemas.userSchema>;
export type LoginInput = z.infer<typeof schemas.loginInputSchema>;
export type LoginOutput = z.infer<typeof schemas.loginOutputSchema>;
export type RegisterInput = z.infer<typeof schemas.registerInputSchema>;
export type UpdateProfileInformationInput = z.infer<
	typeof schemas.updateProfileInformationInputSchema
>;
export type ConfirmPasswordInput = z.infer<
	typeof schemas.confirmPasswordInputSchema
>;
export type UpdatePasswordInput = z.infer<
	typeof schemas.updatePasswordInputSchema
>;
export type TwoFactorQrCode = z.infer<typeof schemas.twoFactorQrCodeSchema>;
export type TwoFactorRecoveryCodes = z.infer<
	typeof schemas.twoFactorRecoveryCodesSchema
>;
export type ConfirmTwoFactorInput = z.infer<
	typeof schemas.confirmTwoFactorInputSchema
>;
export type TwoFactorChallengeInput = z.infer<
	typeof schemas.twoFactorChallengeInputSchema
>;
export type ForgotPasswordInput = z.infer<
	typeof schemas.forgotPasswordInputSchema
>;
export type ResetPasswordInput = z.infer<
	typeof schemas.resetPasswordInputSchema
>;

export * from "./schemas";
