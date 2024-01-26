//websocket init
const socket = new WebSocket('ws://localhost:3000');
let userName;

//username function
function usernamePrompt() {
  userName = prompt('Please enter a cool username:');
  if (userName) {
    //make sure username is sent as string
    socket.send(String(userName));
  } else {
    usernamePrompt(); //if empty, prompt user again
  }
}




socket.binaryType = 'arraybuffer';

//if websocket connection succeeds-- get username
socket.addEventListener('open', () => {
  usernamePrompt();
});

//message send function
function sendMessage(e) {
  e.preventDefault();
  const input = document.querySelector('input');
  if (input.value) {
    const message = input.value;
    socket.send(message);
    input.value = '';
  }
  input.focus();
}


document.querySelector('form').addEventListener('submit', sendMessage);

//listen for messages
socket.addEventListener('message', ({ data }) => {
  const li = document.createElement('li');
  li.textContent = data;
  document.querySelector('ul').appendChild(li);
});
