/**
 * Created by Leo on 2016/3/12.
 */
var mongoose = require('mongoose');
var config = require('config');

mongoose.connect(config.db, {
    server: {poolSize: 20}
}, function (err) {
    if (err) {
        console.log(err);
    }
});

require('./models/dic');
require('./models/good');
require('./models/old_order');
require('./models/order');
require('./models/order_user_good');
require('./models/user');
require('./models/strategy');
require('./models/permission');
require('./models/user_permission');
require('./models/cart');

module.exports.Dic = mongoose.model('Dic');
module.exports.Good = mongoose.model('Good');
module.exports.OldOrder = mongoose.model('OldOrder');
module.exports.Order = mongoose.model('Order');
module.exports.OrderUserGood = mongoose.model('OrderUserGood');
module.exports.User = mongoose.model('User');
module.exports.Strategy = mongoose.model('Strategy');
module.exports.Permission = mongoose.model('Permission');
module.exports.UserPermission = mongoose.model('UserPermission');
module.exports.Cart = mongoose.model('Cart');

module.exports.ValidateGood = require('./validators/good').ValidateGood;