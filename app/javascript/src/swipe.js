// /usersのときだけ発動する
if(location.pathname == "/users") {
  $(function () {
    // 全ユーザの情報を格納
    let allCards = document.querySelectorAll('.swipe--card');

    // スワイプしたときに浮上するハートとバツマーク要素を格納
    let swipeContainer = document.querySelector('.swipe');

    function initCards() {

      // .removed属性のない要素を格納
      let newCards = document.querySelectorAll('.swipe--card:not(.removed)');

      // each文で各要素に属性を付与。重ね順番、移動と縮小、透過度。
      newCards.forEach(function (card, index) {
        card.style.zIndex = allCards.length - index;
        card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(-' + 30 * index + 'px)';
        card.style.opacity = (10 - index) / 10;
      });

      if (newCards.length == 0) {
        $(".no-user").addClass("is-active");
      }
    }

    initCards();

    // hammerjsを利用してイベントを付与？
    allCards.forEach(function (el) {
      // panというイベントを各要素登録
      let hammertime = new Hammer(el);

      // カードを移動させたときの処理
      hammertime.on('pan', function (event) {
        // deltaX: x軸の動き　centerはポインタの位置。動きがなければ処理を終える
        if (event.deltaX === 0) return;
        if (event.center.x === 0 && event.center.y === 0) return;

        el.classList.add('moving');

        swipeContainer.classList.toggle('swipe_like', event.deltaX > 0);
        swipeContainer.classList.toggle('swipe_dislike', event.deltaX < 0);

        // ポインタの場所によって、画像の回転させる計算をしている
        let xMulti = event.deltaX * 0.03;
        let yMulti = event.deltaY / 80;
        let rotate = xMulti * yMulti;

        // 導出した値をtransform属性に割り当てている
        event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';
      });

      // スワイプし終わった後の処理
      hammertime.on('panend', function (event) {
        el.classList.remove('moving');

        // ハートとバツの要素から属性を削除。よってnoneになる
        swipeContainer.classList.remove('swipe_like');
        swipeContainer.classList.remove('swipe_dislike');

        // ブラウザの表示領域の取得
        let moveOutWidth = document.body.clientWidth;

        // 横への移動が200px?未満ならtureを格納
        let keep = Math.abs(event.deltaX) < 200

        // trueなら属性追加。falseなら属性削除
        event.target.classList.toggle('removed', !keep);

        // スワイプ位置によって処理を変更している
        if (keep) {
          event.target.style.transform = '';
        } else {
          // Math.maxは引数の最大を返却
          let endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth) + 100;
          let toX = event.deltaX > 0 ? endX : -endX;
          let endY = Math.abs(event.velocityY) * moveOutWidth;
          let toY = event.deltaY > 0 ? endY : -endY;
          let xMulti = event.deltaX * 0.03;
          let yMulti = event.deltaY / 80;
          let rotate = xMulti * yMulti;

          event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';

          initCards();
        }
      });
    });

    // ボタンを押したらカードがスワイプする機能の追加
    function createButtonListener(reaction) {
      let cards = document.querySelectorAll('.swipe--card:not(.removed)');

      // スワイプするカードがなければfalse
      if (!cards.length) return false;

      let moveOutWidth = document.body.clientWidth * 2;

      let card = cards[0];
      card.classList.add('removed');

      if (reaction == "like") {
        card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
      } else {
        card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
      }

      initCards();
    }

    $('#like').on('click', function() {
      createButtonListener("like");
    })

    $('#dislike').on('click', function() {
      createButtonListener("dislike");
    })
  });
}
