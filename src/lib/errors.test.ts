import { describe, expect, it } from "vitest";
import {
	ForbiddenError,
	NotFoundError,
	ServerError,
	UnauthorizedError,
	UnknownError,
} from "./errors";

describe("Custom Errors", () => {
	describe("UnauthorizedError", () => {
		it("should have default message", () => {
			const error = new UnauthorizedError();
			expect(error.message).toBe("Unauthorized");
		});

		it("should accept custom message", () => {
			const error = new UnauthorizedError("Custom unauthorized message");
			expect(error.message).toBe("Custom unauthorized message");
		});

		it("should be instance of Error", () => {
			const error = new UnauthorizedError();
			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(UnauthorizedError);
		});
	});

	describe("ForbiddenError", () => {
		it("should have default message", () => {
			const error = new ForbiddenError();
			expect(error.message).toBe("Forbidden");
		});

		it("should accept custom message", () => {
			const error = new ForbiddenError("Access denied");
			expect(error.message).toBe("Access denied");
		});

		it("should be instance of Error", () => {
			const error = new ForbiddenError();
			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(ForbiddenError);
		});
	});

	describe("NotFoundError", () => {
		it("should have default message", () => {
			const error = new NotFoundError();
			expect(error.message).toBe("Not Found");
		});

		it("should accept custom message", () => {
			const error = new NotFoundError("Resource not found");
			expect(error.message).toBe("Resource not found");
		});

		it("should be instance of Error", () => {
			const error = new NotFoundError();
			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(NotFoundError);
		});
	});

	describe("ServerError", () => {
		it("should have default message", () => {
			const error = new ServerError();
			expect(error.message).toBe("Server Error");
		});

		it("should accept custom message", () => {
			const error = new ServerError("Internal server error");
			expect(error.message).toBe("Internal server error");
		});

		it("should be instance of Error", () => {
			const error = new ServerError();
			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(ServerError);
		});
	});

	describe("UnknownError", () => {
		it("should have default message", () => {
			const error = new UnknownError();
			expect(error.message).toBe("Unknown Error");
		});

		it("should accept custom message", () => {
			const error = new UnknownError("Something went wrong");
			expect(error.message).toBe("Something went wrong");
		});

		it("should be instance of Error", () => {
			const error = new UnknownError();
			expect(error).toBeInstanceOf(Error);
			expect(error).toBeInstanceOf(UnknownError);
		});
	});
});
