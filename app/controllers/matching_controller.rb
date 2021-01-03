class MatchingController < ApplicationController
  before_action :authenticate_user!

  def index
    # 自分に対して いいね をしてくれているユーザーのレコード群を抽出。そのレコードのなかからfrom_user_idの配列を格納する
    got_reaction_user_ids = Reaction.where(to_user_id: current_user.id, status: 'like').pluck(:from_user_id)

    # 自分が いいね している　かつ　自分をいいね してくれている レコード群を抽出。その後、マッチングしたユーザーの配列を作成
    @match_users = Reaction.where(to_user_id: got_reaction_user_ids, from_user_id: current_user.id, status: 'like').map(&:to_user)
    @user = User.find(current_user.id)
  end
end
