const History = require("../model/history");
const utils = require("../utils/user");

module.exports = {
  saveMsg: ({ msg, user, room }) => {
    const history = new History({
      message: msg,
      sender: user,
      date: utils.dateFormat(),
      room,
    });

    history.save();
  },
};
