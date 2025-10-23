import { 
  Model, 
  DataTypes, 
  InferAttributes, 
  InferCreationAttributes, 
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';

export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export class Order extends Model<
  InferAttributes<Order>,
  InferCreationAttributes<Order>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare amount: number;
  declare status: OrderStatus;
  declare idempotencyKey: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    status: {
      type: DataTypes.ENUM(...Object.values(OrderStatus)),
      allowNull: false,
      defaultValue: OrderStatus.PENDING
    },
    idempotencyKey: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: 'orders',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['idempotencyKey'], unique: true }
    ]
  }
);