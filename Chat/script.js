document.addEventListener("DOMContentLoaded", function () {

  const textContainer = document.querySelector(".text-container");
  const locationBtn = document.getElementById("location");
  const inputValue = document.getElementById("message-input");
  const sendMessageBtn = document.getElementById("sendMessageBtn");

  inputValue.focus();
  
  const wsUrl = "wss://echo-ws-service.herokuapp.com";
  let websocket;

  const sendToServer = function () {
    websocket = new WebSocket(wsUrl);

    websocket.onopen = function () {
      console.log("connected");
      websocket.send(inputValue.value);
      inputValue.value = "";
    };

    websocket.onmessage = function (evt) {
      const serverResponse = document.createElement("div");
      serverResponse.classList.add("receivedMessageContainer");

      serverResponse.innerHTML = evt.data;
      textContainer.appendChild(serverResponse);

      textContainer.scrollTop = textContainer.scrollHeight;
    };
  };

  const sendMessageFunction = function () {
    const sentMessageWindow = document.createElement("div");
    sentMessageWindow.classList.add("sentMessageContainer");
    sentMessageWindow.innerHTML = inputValue.value;
    textContainer.appendChild(sentMessageWindow);
    textContainer.scrollTop = textContainer.scrollHeight;
  };

  sendMessageBtn.addEventListener("click", sendToServer);

  sendMessageBtn.addEventListener("click", sendMessageFunction);

  addEventListener("keydown", function (evt) {
    if (evt.key === "Enter") {
      if (inputValue.value.trim() !== "") {
        evt.preventDefault();
        sendMessageFunction();
        sendToServer();
      }
    }
  });


});
