"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerEntry = exports.Order = exports.User = void 0;
const User_1 = require("./User");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return User_1.User; } });
const Order_1 = require("./Order");
Object.defineProperty(exports, "Order", { enumerable: true, get: function () { return Order_1.Order; } });
const LedgerEntry_1 = require("./LedgerEntry");
Object.defineProperty(exports, "LedgerEntry", { enumerable: true, get: function () { return LedgerEntry_1.LedgerEntry; } });
// Определяем связи между моделями
User_1.User.hasMany(Order_1.Order, {
    foreignKey: 'userId',
    as: 'orders'
});
Order_1.Order.belongsTo(User_1.User, {
    foreignKey: 'userId',
    as: 'user'
});
Order_1.Order.hasMany(LedgerEntry_1.LedgerEntry, {
    foreignKey: 'orderId',
    as: 'ledgerEntries'
});
LedgerEntry_1.LedgerEntry.belongsTo(Order_1.Order, {
    foreignKey: 'orderId',
    as: 'order'
});
