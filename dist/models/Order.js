"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.OrderStatus = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["COMPLETED"] = "COMPLETED";
    OrderStatus["FAILED"] = "FAILED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
class Order extends sequelize_1.Model {
}
exports.Order = Order;
Order.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0.01
        }
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(OrderStatus)),
        allowNull: false,
        defaultValue: OrderStatus.PENDING
    },
    idempotencyKey: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE
}, {
    sequelize: database_1.sequelize,
    tableName: 'orders',
    timestamps: true,
    indexes: [
        { fields: ['userId'] },
        { fields: ['idempotencyKey'], unique: true }
    ]
});
