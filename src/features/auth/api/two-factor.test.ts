import { describe, expect, it } from "vitest";
import {
	confirmTwoFactor,
	disableTwoFactor,
	enableTwoFactor,
	fetchTwoFactorQrCode,
	fetchTwoFactorRecoveryCodes,
	twoFactorChallenge,
} from "./two-factor";

describe("two-factor API", () => {
	describe("enableTwoFactor", () => {
		it("should call enable 2FA endpoint", async () => {
			await expect(enableTwoFactor()).resolves.not.toThrow();
		});
	});

	describe("disableTwoFactor", () => {
		it("should call disable 2FA endpoint", async () => {
			await expect(disableTwoFactor()).resolves.not.toThrow();
		});
	});

	describe("fetchTwoFactorQrCode", () => {
		it("should fetch and parse QR code", async () => {
			const result = await fetchTwoFactorQrCode();

			expect(result.svg).toBe("<svg>mock-qr-code</svg>");
		});
	});

	describe("fetchTwoFactorRecoveryCodes", () => {
		it("should fetch and parse recovery codes", async () => {
			const result = await fetchTwoFactorRecoveryCodes();

			expect(result).toHaveLength(8);
			expect(result[0]).toBe("recovery-code-1");
		});
	});

	describe("confirmTwoFactor", () => {
		it("should call confirm 2FA endpoint", async () => {
			await expect(confirmTwoFactor({ code: "123456" })).resolves.not.toThrow();
		});
	});

	describe("twoFactorChallenge", () => {
		it("should call challenge endpoint with code", async () => {
			await expect(
				twoFactorChallenge({ code: "123456" }),
			).resolves.not.toThrow();
		});

		it("should call challenge endpoint with recovery code", async () => {
			await expect(
				twoFactorChallenge({ recoveryCode: "ABC123" }),
			).resolves.not.toThrow();
		});
	});
});
