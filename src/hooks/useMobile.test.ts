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

	it("returns false initially when the width is above the breakpoint", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 1024,
		});

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(false);
	});

	it("returns true when the width is below the breakpoint", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 600,
		});

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(true);
	});

	it("returns false when the width is exactly at the breakpoint", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 768,
		});

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(false);
	});

	it("adds an event listener on mount", () => {
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

	it("removes the event listener on unmount", () => {
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

	it("updates when the window is resized", () => {
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

	it("uses the correct breakpoint value", () => {
		Object.defineProperty(window, "innerWidth", {
			writable: true,
			value: 767, // Just below 768
		});

		const { result } = renderHook(() => useIsMobile());

		expect(result.current).toBe(true);
	});
});
