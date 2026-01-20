export class UnauthorizedError extends Error {
	constructor(message?: string) {
		super(message || "Unauthorized");
	}
}

export class ForbiddenError extends Error {
	constructor(message?: string) {
		super(message || "Forbidden");
	}
}

export class NotFoundError extends Error {
	constructor(message?: string) {
		super(message || "Not Found");
	}
}

export class ServerError extends Error {
	constructor(message?: string) {
		super(message || "Server Error");
	}
}

export class UnknownError extends Error {
	constructor(message?: string) {
		super(message || "Unknown Error");
	}
}
