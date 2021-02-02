const roomName = $("#room-name");
const userList = $("#userList");
const messageBox = $("#messageBox");
const msgFrom = $("#msgFrom");
// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(
  `%c username: ${username}\nRoom: ${room}`,
  "background: lightcoral"
);

const socket = io();

// Join chatroom
socket.emit("joinChat", { username, room });

// receive room with list of users
socket.on("roomUsers", ({ room, users }) => {
  console.log(`%c room: ${room}`, "color: lightgreen");
  console.log("users:", users);

  // output room name
  roomName.text(room);

  // list up users registered to the chat room
  userList.text("");
  users.forEach(({ id, username }) => {
    userList.append(
      `<li><i class="far fa-id-badge"></i> ${username} - ID: ${id}</li>`
    );
  });
});

// receive message from a server
socket.on("message", (data) => {
  console.log(data)
  outputMessage(data);
});

// send message to a server
msgFrom.submit((e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
const outputMessage = async ({ msg, user, rand }) => {
  let serverIcon = "img/ball.png";
  const randNum = user[0].charCodeAt()
  const api = `https://pokeapi.co/api/v2/pokemon/${randNum}`;
  let img;
  if(user !== "Server") {
    await $.get(api, (res, status) => {
      img = res.sprites.front_default
    })
  }
    
  const imgSize = user === "Server" ? 50 : 100

  let msgTag = $(`<div>
                    <span><img width="${imgSize}" height="${imgSize}" src="${user === "Server" ? serverIcon : img}" alt="user-icon"></span>
                    <span>${user}: </span>
                    <span>${msg}</span>
                  </div>`);
  $(msgTag).appendTo(messageBox);
}
