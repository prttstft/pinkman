var l = require('../utilities/logUtils');
var db = require('../api/controllers/dbRequests');
var sendMessage = require('../api/controllers/SendMessages');
var decide = require('./decide');

function received(sender, text) {
    l.d('Nachricht empfangen von '+ sender + ': ' +text);
    /*get user from DB*/
    sendMessage.sendTypingOn(sender);
    db.userByFbId(sender, function (result) {
        if (result.data[0]) {
            decide.dodecide(text, result.data[0]);
        }
        else {
            l.d("User not in DB");
            db.createUser(sender, function (result, id) {
                l.d(result['fbId']);
                result.id = id;
                decide.dodecide(text, result)
            });
        }
    });
}

module.exports = {
    received: received
};
