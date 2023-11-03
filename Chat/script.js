document.addEventListener("DOMContentLoaded", function () {
  const textContainer = document.querySelector(".text-container");
  const locationBtn = document.getElementById("location");
  const inputValue = document.getElementById("message-input");
  const sendMessageBtn = document.getElementById("sendMessageBtn");
  const status = document.createElement("div");
  inputValue.focus();

  const error = () => {
    status.textContent = "Невозможно получить ваше местоположение";
  };

  const getLocation = function () {
    status.classList.add("locationWindow");
    textContainer.appendChild(status);
  };

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.innerHTML = `Широта: ${latitude}° <br> <br> Долгота: ${longitude}°
    <br> <br>
    <a id='locationLink' href='https://www.openstreetmap.org/#map=18/${latitude}/${longitude}'>Ссылка на карту</a>`;

    textContainer.scrollTop = textContainer.scrollHeight;

  };

  locationBtn.addEventListener("click", () => {
    getLocation();
    if (!navigator.geolocation) {
      status.textContent = "Geolocation не поддерживается вашим браузером";
    } else {
      status.textContent = "Определение местоположения…";
      navigator.geolocation.getCurrentPosition(success, error);
    }
  });

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

  sendMessageBtn.addEventListener("click", function () {
    if (inputValue.value.trim() !== "") {
      sendMessageFunction();
      sendToServer();
    }
  });

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
