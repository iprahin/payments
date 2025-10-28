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

export enum UserRolesTypes {
    ADMIN = 1,
    MANAGER = 2,
    GUEST = 3,
    CUSTOMER = 4
}


export class UserRoles extends Model<
  InferAttributes<UserRoles>,
  InferCreationAttributes<UserRoles>
> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare roleId: number;
  declare createdAt: CreationOptional<Date>;
}


UserRoles.init({

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
            isIn: [Object.values(UserRolesTypes)]
        }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    tableName: 'user_roles',
    timestamps: true,
    updatedAt: false,
    indexes: [
      { fields: ['roleId'] },
      { fields: ['userId'] }
    ]
})

