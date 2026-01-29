import type { RequestHandler } from "msw";
import { server } from "@/mocks/server";

/**
 * Override handlers for a specific test.
 * Use in beforeEach or within individual tests.
 */
export const useHandlers = (...handlers: RequestHandler[]) => {
	server.use(...handlers);
};

/**
 * Reset all handlers to defaults.
 * Usually not needed as setup.ts does this in afterEach.
 */
export const resetHandlers = () => {
	server.resetHandlers();
};

// Re-export server for direct access when needed
export { server };
