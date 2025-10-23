"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZeroEmptyAmount = exports.DuplicateKeyError = exports.UserNotFoundError = exports.InsufficientBalanceError = void 0;
class InsufficientBalanceError extends Error {
    constructor(required, available) {
        super(`Недостаточно средств. Требуется: ${required}, доступно: ${available}`);
        this.name = 'InsufficientBalanceError';
    }
}
exports.InsufficientBalanceError = InsufficientBalanceError;
class UserNotFoundError extends Error {
    constructor(userId) {
        super(`Пользователь ${userId} не найден`);
        this.name = 'UserNotFoundError';
    }
}
exports.UserNotFoundError = UserNotFoundError;
class DuplicateKeyError extends Error {
    constructor(idempotencyKey) {
        super(`заказ с ключом ${idempotencyKey} уже существует`);
        this.name = 'DuplicateKeyError';
    }
}
exports.DuplicateKeyError = DuplicateKeyError;
class ZeroEmptyAmount extends Error {
    constructor(amount) {
        super(`Сумма пополнения ${amount} не может быть нулевая или отрицательная`);
        this.name = 'ZeroEmptyAmount';
    }
}
exports.ZeroEmptyAmount = ZeroEmptyAmount;
