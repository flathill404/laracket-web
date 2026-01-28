import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Cleanup after each test
afterEach(() => {
	cleanup();
	vi.clearAllMocks();
});

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Mock ResizeObserver for components that use it (e.g., input-otp)
class ResizeObserverMock {
	observe() {}
	unobserve() {}
	disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

// Mock Element methods for radix-ui primitives (Command, Dialog, Sheet, etc.)
Object.assign(window.Element.prototype, {
	scrollIntoView: vi.fn(),
	setPointerCapture: vi.fn(),
	releasePointerCapture: vi.fn(),
	hasPointerCapture: vi.fn(() => false),
});

// Mock HTMLElement methods for radix-ui
Object.assign(window.HTMLElement.prototype, {
	scrollIntoView: vi.fn(),
});
