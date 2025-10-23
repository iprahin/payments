import { User } from './User';
import { Order } from './Order';
import { LedgerEntry } from './LedgerEntry';

// Определяем связи между моделями
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders'
});

Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

Order.hasMany(LedgerEntry, {
  foreignKey: 'orderId',
  as: 'ledgerEntries'
});

LedgerEntry.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order'
});

export { User, Order, LedgerEntry };