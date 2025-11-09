/**
 * ドメインエラーの基底クラス
 */
export abstract class DomainError extends Error {
	constructor(
		message: string,
		public readonly statusCode: number,
	) {
		super(message);
		this.name = this.constructor.name;
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

/**
 * リソースが見つからない場合のエラー
 */
export class NotFoundError extends DomainError {
	constructor(message = "Resource not found") {
		super(message, 404);
	}
}

/**
 * リソースが既に存在する場合のエラー
 */
export class ConflictError extends DomainError {
	constructor(message = "Resource already exists") {
		super(message, 409);
	}
}

/**
 * バリデーションエラー
 */
export class ValidationError extends DomainError {
	constructor(message = "Validation failed") {
		super(message, 400);
	}
}

/**
 * 内部サーバーエラー
 */
export class InternalServerError extends DomainError {
	constructor(message = "Internal server error") {
		super(message, 500);
	}
}
