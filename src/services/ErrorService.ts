export class InsufficientBalanceError extends Error {
    constructor(required: number, available: number) {
        super(`Недостаточно средств. Требуется: ${required}, доступно: ${available}`);
        this.name = 'InsufficientBalanceError';
    }
}

export class UserNotFoundError extends Error {
    constructor(userId: number) {
        super(`Пользователь ${userId} не найден`);
        this.name = 'UserNotFoundError';
    }
}


export class DuplicateKeyError extends Error {
    constructor(idempotencyKey: string) {
        super(`заказ с ключом ${idempotencyKey} уже существует`);
        this.name = 'DuplicateKeyError';
    }
}


export class ZeroEmptyAmount extends Error {
    constructor(amount: number) {
        super(`Сумма пополнения ${amount} не может быть нулевая или отрицательная`);
        this.name = 'ZeroEmptyAmount'
    }
}
