import { 
  Model, 
  DataTypes, 
  InferAttributes, 
  InferCreationAttributes, 
  CreationOptional,
  ForeignKey
} from 'sequelize';
import { sequelize } from '../config/database';
import { Order } from './Order';

export enum LedgerEntryType {
  DEBIT = 'DEBIT',   // Списание
  CREDIT = 'CREDIT'  // Зачисление
}

export class LedgerEntry extends Model<
  InferAttributes<LedgerEntry>,
  InferCreationAttributes<LedgerEntry>
> {
  declare id: CreationOptional<number>;
  declare orderId: ForeignKey<Order['id']>;
  declare userId: number;
  declare amount: number;
  declare type: LedgerEntryType;
  declare description: string;
  declare createdAt: CreationOptional<Date>;
}

LedgerEntry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(...Object.values(LedgerEntryType)),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'ledger_entries',
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ['orderId'] },
      { fields: ['userId'] }
    ]
  }
);
