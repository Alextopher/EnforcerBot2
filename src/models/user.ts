// /models/User.ts
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from './index';

interface UserAttributes {
  id: string;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}

interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
      createdAt?: Date;
      updatedAt?: Date;
    }

const User = sequelize.define<UserInstance>(
  'User',
  {
    id: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
  }
);

export default User;
