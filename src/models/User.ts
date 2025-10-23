import { 
  Model, 
  DataTypes, 
  InferAttributes, 
  InferCreationAttributes, 
  CreationOptional 
} from 'sequelize';
import { sequelize } from '../config/database';


export enum UserStatus {
    ACTIVE = 'ACTIVE',
    DELETED = 'DELETED',
    PENDING = 'PENDING'
}


// Используем современный TypeScript подход с InferAttributes
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare status: UserStatus;
  declare email: string;
  declare balance: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    status: {
        type: DataTypes.ENUM(...Object.values(UserStatus)),
        allowNull: false,
        defaultValue: UserStatus.ACTIVE
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true
  }
);