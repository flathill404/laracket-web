import { describe, expect, it } from "vitest";
import {
	confirmPasswordInputSchema,
	confirmTwoFactorInputSchema,
	forgotPasswordInputSchema,
	loginInputSchema,
	loginOutputSchema,
	registerInputSchema,
	resetPasswordInputSchema,
	twoFactorChallengeInputSchema,
	twoFactorQrCodeSchema,
	twoFactorRecoveryCodesSchema,
	updatePasswordInputSchema,
	updateProfileInformationInputSchema,
	userSchema,
} from "./schemas";

describe("auth schemas", () => {
	describe("userSchema", () => {
		it("should validate a valid user", () => {
			const user = {
				id: "123",
				name: "john_doe",
				displayName: "John Doe",
				email: "john@example.com",
				emailVerifiedAt: "2024-01-01T00:00:00Z",
				avatarUrl: "https://example.com/avatar.jpg",
				twoFactorStatus: "disabled",
			};
			expect(() => userSchema.parse(user)).not.toThrow();
		});

		it("should allow null displayName", () => {
			const user = {
				id: "123",
				name: "john_doe",
				displayName: null,
				email: "john@example.com",
				emailVerifiedAt: null,
				avatarUrl: null,
				twoFactorStatus: "enabled",
			};
			expect(() => userSchema.parse(user)).not.toThrow();
		});

		it("should reject invalid email", () => {
			const user = {
				id: "123",
				name: "john_doe",
				email: "invalid-email",
				twoFactorStatus: "disabled",
			};
			expect(() => userSchema.parse(user)).toThrow();
		});

		it("should reject invalid twoFactorStatus", () => {
			const user = {
				id: "123",
				name: "john_doe",
				email: "john@example.com",
				twoFactorStatus: "invalid",
			};
			expect(() => userSchema.parse(user)).toThrow();
		});

		it("should accept all valid twoFactorStatus values", () => {
			for (const status of ["disabled", "pending", "enabled"]) {
				const user = {
					id: "123",
					name: "john_doe",
					email: "john@example.com",
					twoFactorStatus: status,
				};
				expect(() => userSchema.parse(user)).not.toThrow();
			}
		});
	});

	describe("loginInputSchema", () => {
		it("should validate valid login input", () => {
			const input = {
				email: "test@example.com",
				password: "password123",
				remember: true,
			};
			expect(() => loginInputSchema.parse(input)).not.toThrow();
		});

		it("should default remember to false", () => {
			const input = {
				email: "test@example.com",
				password: "password123",
			};
			const result = loginInputSchema.parse(input);
			expect(result.remember).toBe(false);
		});

		it("should reject password shorter than 8 characters", () => {
			const input = {
				email: "test@example.com",
				password: "short",
			};
			expect(() => loginInputSchema.parse(input)).toThrow();
		});

		it("should reject invalid email", () => {
			const input = {
				email: "invalid",
				password: "password123",
			};
			expect(() => loginInputSchema.parse(input)).toThrow();
		});
	});

	describe("loginOutputSchema", () => {
		it("should validate valid login output", () => {
			expect(() => loginOutputSchema.parse({ twoFactor: true })).not.toThrow();
			expect(() => loginOutputSchema.parse({ twoFactor: false })).not.toThrow();
		});

		it("should reject non-boolean twoFactor", () => {
			expect(() => loginOutputSchema.parse({ twoFactor: "yes" })).toThrow();
		});
	});

	describe("registerInputSchema", () => {
		it("should validate valid registration input", () => {
			const input = {
				name: "johndoe",
				displayName: "John Doe",
				email: "john@example.com",
				password: "password123",
				passwordConfirmation: "password123",
			};
			expect(() => registerInputSchema.parse(input)).not.toThrow();
		});

		it("should reject empty name", () => {
			const input = {
				name: "",
				displayName: "John Doe",
				email: "john@example.com",
				password: "password123",
				passwordConfirmation: "password123",
			};
			expect(() => registerInputSchema.parse(input)).toThrow();
		});

		it("should reject short password", () => {
			const input = {
				name: "johndoe",
				displayName: "John Doe",
				email: "john@example.com",
				password: "short",
				passwordConfirmation: "short",
			};
			expect(() => registerInputSchema.parse(input)).toThrow();
		});
	});

	describe("updateProfileInformationInputSchema", () => {
		it("should validate valid profile update", () => {
			const input = {
				displayName: "New Name",
				email: "new@example.com",
			};
			expect(() =>
				updateProfileInformationInputSchema.parse(input),
			).not.toThrow();
		});

		it("should reject invalid email", () => {
			const input = {
				displayName: "New Name",
				email: "invalid",
			};
			expect(() => updateProfileInformationInputSchema.parse(input)).toThrow();
		});
	});

	describe("confirmPasswordInputSchema", () => {
		it("should validate password confirmation", () => {
			expect(() =>
				confirmPasswordInputSchema.parse({ password: "anypassword" }),
			).not.toThrow();
		});

		it("should reject missing password", () => {
			expect(() => confirmPasswordInputSchema.parse({})).toThrow();
		});
	});

	describe("updatePasswordInputSchema", () => {
		it("should validate valid password update", () => {
			const input = {
				currentPassword: "oldpassword",
				password: "newpassword123",
				passwordConfirmation: "newpassword123",
			};
			expect(() => updatePasswordInputSchema.parse(input)).not.toThrow();
		});

		it("should reject short new password", () => {
			const input = {
				currentPassword: "oldpassword",
				password: "short",
				passwordConfirmation: "short",
			};
			expect(() => updatePasswordInputSchema.parse(input)).toThrow();
		});
	});

	describe("twoFactorQrCodeSchema", () => {
		it("should validate QR code response", () => {
			expect(() =>
				twoFactorQrCodeSchema.parse({ svg: "<svg>...</svg>" }),
			).not.toThrow();
		});
	});

	describe("twoFactorRecoveryCodesSchema", () => {
		it("should validate recovery codes array", () => {
			const codes = ["ABC123", "DEF456", "GHI789"];
			expect(() => twoFactorRecoveryCodesSchema.parse(codes)).not.toThrow();
		});

		it("should allow empty array", () => {
			expect(() => twoFactorRecoveryCodesSchema.parse([])).not.toThrow();
		});
	});

	describe("confirmTwoFactorInputSchema", () => {
		it("should validate 2FA confirmation code", () => {
			expect(() =>
				confirmTwoFactorInputSchema.parse({ code: "123456" }),
			).not.toThrow();
		});
	});

	describe("twoFactorChallengeInputSchema", () => {
		it("should validate with code", () => {
			expect(() =>
				twoFactorChallengeInputSchema.parse({ code: "123456" }),
			).not.toThrow();
		});

		it("should validate with recovery code", () => {
			expect(() =>
				twoFactorChallengeInputSchema.parse({ recoveryCode: "ABC123" }),
			).not.toThrow();
		});

		it("should validate with both empty (schema allows optional)", () => {
			expect(() => twoFactorChallengeInputSchema.parse({})).not.toThrow();
		});
	});

	describe("forgotPasswordInputSchema", () => {
		it("should validate email", () => {
			expect(() =>
				forgotPasswordInputSchema.parse({ email: "test@example.com" }),
			).not.toThrow();
		});

		it("should reject invalid email", () => {
			expect(() =>
				forgotPasswordInputSchema.parse({ email: "invalid" }),
			).toThrow();
		});
	});

	describe("resetPasswordInputSchema", () => {
		it("should validate valid reset password input", () => {
			const input = {
				email: "test@example.com",
				password: "newpassword123",
				passwordConfirmation: "newpassword123",
				token: "reset-token-abc",
			};
			expect(() => resetPasswordInputSchema.parse(input)).not.toThrow();
		});

		it("should reject short password", () => {
			const input = {
				email: "test@example.com",
				password: "short",
				passwordConfirmation: "short",
				token: "reset-token-abc",
			};
			expect(() => resetPasswordInputSchema.parse(input)).toThrow();
		});
	});
});
