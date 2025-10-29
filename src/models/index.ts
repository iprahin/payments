import { User } from './User';
import { Order } from './Order';
import { LedgerEntry } from './LedgerEntry';
import { UserRoles } from './UserRoles';
import { Token } from './Token';

User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders'
});

User.hasMany(UserRoles, {
  foreignKey: 'userId',
  as: 'user_roles'
});

User.hasOne(Token, {
  foreignKey: 'userId',
  as: 'tokens'
});


Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Order.hasMany(LedgerEntry, {
  foreignKey: 'orderId',
  as: 'ledgerEntries'
});


UserRoles.belongsTo(User, {
  foreignKey: 'userId'
  //as: 'user'
});


LedgerEntry.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});


Token.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});


export { User, Order, LedgerEntry, UserRoles, Token };