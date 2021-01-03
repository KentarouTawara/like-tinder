class ChatRoomsController < ApplicationController
  before_action :authenticate_user!

  def create
    # 中間テーブルからuser_idが自分のものを取得。その中から、chat_roomの配列を返却。
    current_user_chat_rooms = ChatRoomUser.where(user_id: current_user.id).map(&:chat_room)
    # 自分が含まれるレコード群のなかから、マッチング相手のuser_idが含まれているレコードを取得。理論上1件のみ。
    chat_room = ChatRoomUser.where(chat_room: current_user_chat_rooms, user_id: params[:user_id]).map(&:chat_room).first

    if chat_room.blank?
      chat_room = ChatRoom.create
      ChatRoomUser.create(chat_room: chat_room, user_id: current_user.id)
      ChatRoomUser.create(chat_room: chat_room, user_id: params[:user_id])
    end
    redirect_to action: :show, id: chat_room.id
  end

  def show
    @chat_room = ChatRoom.find(params[:id])
    # チャットルームの相手の情報の取得
    @chat_room_user = @chat_room.chat_room_users.where.not(user_id: current_user.id).first.user
    @chat_messages = ChatMessage.where(chat_room: @chat_room)
  end
end
