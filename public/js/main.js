const roomName = $("#room-name");
const userList = $("#userList");
const messageBox = $("#messageBox");
const msgFrom = $("#msgFrom");
// Get username and room from URL
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(
  `%c username: ${username}\nRoom: ${room}`,
  "background: lightcoral"
);

const socket = io();

// Join chatroom
socket.emit("joinChat", {username, room});

// receive room with list of users
socket.on("roomUsers", ({room, users, prevMsg}) => {
  console.log(`%c room: ${room}`, "color: lightgreen");
  console.log("users:", users);
  console.log("previous msg", prevMsg)
  // output room name
  roomName.text(room);

  // list up users registered to the chat room
  userList.text("");
  users.forEach(({id, username}) => {
    userList.append(
      `<li class="bg-transparent-200 p-2 rounded shadow mb-2"><i class="far fa-id-badge mr-3"></i> ${username} - ID: ${id}</li>`
    );
  });

  // prevMsg.forEach(msg => {
  //   outputMessage({
  //     msg,
  //     user: "Server",
  //   });
  // });
});

// receive message from a server
socket.on("message", (data) => outputMessage(data));

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
const outputMessage = async ({msg, user, userIcon}) => {
  let serverIcon = "img/ball.png";
  const imgSize = user === "Server" ? 40 : 80;
  let msgTag = $(`<li class="flex item-center bg-transparent-200 p-2 rounded shadow mb-2">
                    <span class="bg-secondary-100 p-3 rounded shadow w-1/5">
                      <img class="userIcon" width="${imgSize}" height="${imgSize}" src="${user === "Server" ? serverIcon : userIcon}" alt="user-icon">
                      <span>${user.length > 10 ? user.substring(0, 8).concat("...") : user}</span>
                    </span>
                    <span class="ml-3 w-4/5">${msg}</span>
                  </li>`);
  $(msgTag).appendTo(messageBox);
};