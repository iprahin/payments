"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerEntry = exports.LedgerEntryType = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
var LedgerEntryType;
(function (LedgerEntryType) {
    LedgerEntryType["DEBIT"] = "DEBIT";
    LedgerEntryType["CREDIT"] = "CREDIT"; // Зачисление
})(LedgerEntryType || (exports.LedgerEntryType = LedgerEntryType = {}));
class LedgerEntry extends sequelize_1.Model {
}
exports.LedgerEntry = LedgerEntry;
LedgerEntry.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        }
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    type: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(LedgerEntryType)),
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'ledger_entries',
    timestamps: true,
    updatedAt: false,
    indexes: [
        { fields: ['orderId'] },
        { fields: ['userId'] }
    ]
});
