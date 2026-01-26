import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useIsMobile } from "./useMobile";

describe("useIsMobile", () => {
	let mockMatchMedia: ReturnType<typeof vi.fn>;
	let mockAddEventListener: ReturnType<typeof vi.fn>;
	let mockRemoveEventListener: ReturnType<typeof vi.fn>;
	let changeHandler: (() => void) | null = null;

	beforeEach(() => {
		mockAddEventListener = vi.fn((event, handler) => {
			if (event === "change") {
				changeHandler = handler;
			}
		});
		mockRemoveEventListener = vi.fn();

		mockMatchMedia = vi.fn().mockImplementation(() => ({
			matches: false,
			media: "",
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: mockAddEventListener,
			removeEventListener: mockRemoveEventListener,
			dispatchEvent: vi.fn(),
		}));

		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: mockMatchMedia,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		changeHandler = null;
	});

	it("should return false initially when width is above breakpoint", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 1024,
		});

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(false);
	});

	it("should return true when width is below breakpoint", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 600,
		});

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(true);
	});

	it("should return false when width is exactly at breakpoint", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 768,
		});

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(false);
	});

	it("should add event listener on mount", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 1024,
		});

		renderHook(() => useIsMobile());

		expect(mockAddEventListener).toHaveBeenCalledWith(
			"change",
			expect.any(Function),
		);
	});

	it("should remove event listener on unmount", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 1024,
		});

		const { unmount } = renderHook(() => useIsMobile());
		unmount();

		expect(mockRemoveEventListener).toHaveBeenCalledWith(
			"change",
			expect.any(Function),
		);
	});

	it("should update when window is resized", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 1024,
		});

		const { result } = renderHook(() => useIsMobile());
		expect(result.current).toBe(false);

		// Simulate resize to mobile
		act(() => {
			Object.defineProperty(window, "innerWidth", {
				writable: true,
				value: 500,
			});
			if (changeHandler) {
				changeHandler();
			}
		});

		expect(result.current).toBe(true);
	});

	it("should use correct breakpoint value", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 767, // Just below 768
		});

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(true);
	});
});
