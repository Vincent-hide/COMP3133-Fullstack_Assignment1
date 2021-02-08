const fetch = require("node-fetch");

const users = [];

// Join user to chat
const userJoin = async (id, username, room) => {
  const rand = Math.floor(Math.random() * 201) + 1; //  range: 1-200. used for pokemon icon id
  const api = `https://pokeapi.co/api/v2/pokemon/${rand}`;
  let userIcon;

  await fetch(api)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.sprites.front_default);
      userIcon = data.sprites.front_default;
    })
    .catch((err) =>
      console.log("wooooooooo, something went terribly terribly wrong")
    );

  const user = { id, username, room, userIcon };

  users.push(user);

  return user;
};

// Get current user
const getCurrentUser = (id) => {
  return users.find((user) => user.id === id);
};

// User leaves chat
const userLeave = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// Get room users
const getRoomUsers = (room) => {
  return users.filter((user) => user.room === room);
};

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
