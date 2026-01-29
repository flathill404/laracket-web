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
		it("calls the enable 2FA endpoint", async () => {
			await expect(enableTwoFactor()).resolves.not.toThrow();
		});
	});

	describe("disableTwoFactor", () => {
		it("calls the disable 2FA endpoint", async () => {
			await expect(disableTwoFactor()).resolves.not.toThrow();
		});
	});

	describe("fetchTwoFactorQrCode", () => {
		it("fetches and parses the QR code", async () => {
			const result = await fetchTwoFactorQrCode();

			expect(result.svg).toBe("<svg>mock-qr-code</svg>");
		});
	});

	describe("fetchTwoFactorRecoveryCodes", () => {
		it("fetches and parses recovery codes", async () => {
			const result = await fetchTwoFactorRecoveryCodes();

			expect(result).toHaveLength(8);
			expect(result[0]).toBe("recovery-code-1");
		});
	});

	describe("confirmTwoFactor", () => {
		it("calls the confirm 2FA endpoint", async () => {
			await expect(confirmTwoFactor({ code: "123456" })).resolves.not.toThrow();
		});
	});

	describe("twoFactorChallenge", () => {
		it("calls the challenge endpoint with a code", async () => {
			await expect(
				twoFactorChallenge({ code: "123456" }),
			).resolves.not.toThrow();
		});

		it("calls the challenge endpoint with a recovery code", async () => {
			await expect(
				twoFactorChallenge({ recoveryCode: "ABC123" }),
			).resolves.not.toThrow();
		});
	});
});
