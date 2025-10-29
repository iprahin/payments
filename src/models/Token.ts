import { 
  Model, 
  InferAttributes, 
  InferCreationAttributes, 
  CreationOptional,
  ForeignKey,
  DataTypes
} from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './User';


export class Token extends Model<
  InferAttributes<Token>,
  InferCreationAttributes<Token>
> {
    declare id: CreationOptional<number>;
    declare userId: ForeignKey<User['id']>;
    declare refreshToken: string;
    //declare isActive: number;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

Token.init({ 
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
    refreshToken: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false
    }
    /*
    isActive: {
        type: DataTypes.TINYINT,
        defaultValue: 1        
    }*/
    ,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
},
{
    sequelize,
    tableName: 'tokens',
    timestamps: true,
    indexes: [
      { fields: ['userId'] }
      //{ fields: ['isActive'] }
    ]
  }
);