import { User } from './User';
import { Order } from './Order';
import { LedgerEntry } from './LedgerEntry';
import { UserRoles } from './UserRoles';

User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders'
});

User.hasMany(UserRoles, {
  foreignKey: 'userId',
  as: 'user_roles'
});

Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

UserRoles.belongsTo(User, {
  foreignKey: 'userId'
  //as: 'user'
});


Order.hasMany(LedgerEntry, {
  foreignKey: 'orderId',
  as: 'ledgerEntries'
});

LedgerEntry.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

export { User, Order, LedgerEntry, UserRoles };