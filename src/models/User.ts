import bcrypt from 'bcrypt';

import { 
  Model, 
  DataTypes, 
  InferAttributes, 
  InferCreationAttributes, 
  CreationOptional 
} from 'sequelize';
import { sequelize } from '../config/database';
import { UserRoles } from './UserRoles';


export enum UserStatus {
    ACTIVE = 'ACTIVE',
    DELETED = 'DELETED',
    PENDING = 'PENDING'
}


export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare status: UserStatus;
  declare password: string;
  declare email: string;
  declare balance: number;
  declare user_roles?: UserRoles[];
  declare refreshToken?: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;


  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toJSON() {
    const attributes = { ...this.get() };
    //delete attributes.password;

    attributes.password = '.....';

    return attributes;
  }

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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
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
      },
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

User.beforeCreate(async (user, options) => {
  if (user.password) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(user.password, saltRounds);
    user.password = hashed;
  }
});

User.beforeUpdate(async (user, options) => {
  if (user.changed('password')) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(user.password, saltRounds);
    user.password = hashed;
  }
});
