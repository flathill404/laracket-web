import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getMockClient } from "@/test/utils";
import {
	confirmTwoFactor,
	disableTwoFactor,
	enableTwoFactor,
	fetchTwoFactorQrCode,
	fetchTwoFactorRecoveryCodes,
	twoFactorChallenge,
} from "./two-factor";

vi.mock("@/lib/client");

const mockClient = getMockClient();

describe("two-factor API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	describe("enableTwoFactor", () => {
		it("should call enable 2FA endpoint", async () => {
			mockClient.post.mockResolvedValueOnce({});

			await enableTwoFactor();

			expect(mockClient.post).toHaveBeenCalledWith(
				"/user/two-factor-authentication",
			);
		});
	});

	describe("disableTwoFactor", () => {
		it("should call disable 2FA endpoint", async () => {
			mockClient.delete.mockResolvedValueOnce({});

			await disableTwoFactor();

			expect(mockClient.delete).toHaveBeenCalledWith(
				"/user/two-factor-authentication",
			);
		});
	});

	describe("fetchTwoFactorQrCode", () => {
		it("should fetch and parse QR code", async () => {
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve({ svg: "<svg>QR Code</svg>" }),
			});

			const result = await fetchTwoFactorQrCode();

			expect(mockClient.get).toHaveBeenCalledWith("/user/two-factor-qr-code");
			expect(result).toEqual({ svg: "<svg>QR Code</svg>" });
		});
	});

	describe("fetchTwoFactorRecoveryCodes", () => {
		it("should fetch and parse recovery codes", async () => {
			const codes = ["ABC123", "DEF456", "GHI789"];
			mockClient.get.mockResolvedValueOnce({
				json: () => Promise.resolve(codes),
			});

			const result = await fetchTwoFactorRecoveryCodes();

			expect(mockClient.get).toHaveBeenCalledWith(
				"/user/two-factor-recovery-codes",
			);
			expect(result).toEqual(codes);
		});
	});

	describe("confirmTwoFactor", () => {
		it("should call confirm 2FA endpoint", async () => {
			mockClient.post.mockResolvedValueOnce({});

			await confirmTwoFactor({ code: "123456" });

			expect(mockClient.post).toHaveBeenCalledWith(
				"/user/confirmed-two-factor-authentication",
				{ code: "123456" },
			);
		});
	});

	describe("twoFactorChallenge", () => {
		it("should call challenge endpoint with code", async () => {
			mockClient.post.mockResolvedValueOnce({});

			await twoFactorChallenge({ code: "123456" });

			expect(mockClient.post).toHaveBeenCalledWith("/two-factor-challenge", {
				code: "123456",
			});
		});

		it("should call challenge endpoint with recovery code", async () => {
			mockClient.post.mockResolvedValueOnce({});

			await twoFactorChallenge({ recoveryCode: "ABC123" });

			expect(mockClient.post).toHaveBeenCalledWith("/two-factor-challenge", {
				recoveryCode: "ABC123",
			});
		});
	});
});
