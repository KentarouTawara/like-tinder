import consumer from "./consumer"

const appChatRoom = consumer.subscriptions.create("ChatRoomChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  // chat_room_channel.rbから送られてきたdataを受け取り、アラートを表示
  received(data) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.insertAdjacentHTML('beforeend', data['chat_message']);
  },

  // chat_room_channel.rbのspeakアクションにchat_messageを送信
  speak: function(chat_message, chat_room_id) {
    return this.perform('speak', { chat_message: chat_message, chat_room_id: chat_room_id });
  }
});

// chat_rooms/が含まれている場合にのみ発動する
if(/chat_rooms/.test(location.pathname)) {

  // enter を押したら発火する
  $(document).on("keydown", ".chat-room__message-form_textarea", function(e) {
    if (e.key === "Enter") {

      const chat_room_id = $('textarea').data('chat_room_id')

      // speacアクションを発火
      appChatRoom.speak(e.target.value, chat_room_id);

      e.target.value = '';
      e.preventDefault();
    }
  })
}
