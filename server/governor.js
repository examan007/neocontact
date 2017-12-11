function SessionObj(req) {
    var session = {};
    session.remoteip = (req.connection.remoteAddress).toString();
    session.lasttime = (new Date()).getTime();
    if (typeof(session.remoteip) === 'undefined') {
        session = null;
    } else {
    }
    return (session);
}
exports.id = 'server/governor';
var Governor = {
    Sessions : [],
    checkSession : function (req) {
        var allowed = true;
        var session = SessionObj(req);
        if (session == null) {
            allowed = false;
        } else
        if (typeof (Governor.Sessions[session.remoteip]) === 'undefined') {
            Governor.Sessions[session.remoteip] = session;
        } else {
            var session = Governor.Sessions[session.remoteip];
            var thistime = (new Date()).getTime();
            var diff = thistime-session.lasttime;
            session.lasttime = thistime;
            if (diff > 10000) {
            } else {
                console.log('thistime-lastime=[' + diff + ']');
                allowed = false;
            }
        }
        return (allowed);
    }
}
exports.getGovernor = function () {
    return (Governor);
}