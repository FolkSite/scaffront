<!-- passport/content-content.tpl -->

<section class="user-passport usr-pass">

  <form class="usr-pass__form usr-pass-form" method="post">
    <div class="usr-pass__section">
      <div class="usr-pass__section-left usr-pass-form__avatar">
        <p class="thumbnail">
          <img src="{{ avatar_url }}" alt="">
        </p>
        <p>
          <button class="btn btn-default btn-block">Добавить фотографию</button>
        </p>
        <p>
          <button class="btn btn-warning btn-block">Удалить фотографию</button>
        </p>
      </div>
      <div class="usr-pass__section-right usr-pass-form__fields">
        <p class="form-group usr-pass-form__firstname">
          <label for="usr-pass-form-firstname">Имя <span class="color-red">*</span></label>
          <input name="firstname" type="text" class="form-control" id="usr-pass-form-firstname" placeholder="Никита">
        </p>
        <p class="form-group usr-pass-form__lastname">
          <label for="usr-pass-form-lastname">Фамилия <span class="color-red">*</span></label>
          <input name="lastname" type="text" class="form-control" id="usr-pass-form-lastname" placeholder="Фамилия">
        </p>
        <p class="form-group usr-pass-form__thirdname">
          <label for="usr-pass-form-thirdname">Отчество <span class="color-red">*</span></label>
          <input name="thirdname" type="text" class="form-control" id="usr-pass-form-thirdname" placeholder="Отчество">
        </p>
        <p class="form-group usr-pass-form__bdate">
          <label for="usr-pass-form-bdate">День рождения <span class="color-red">*</span></label>
          <span class="usr-pass-form__bdate row">
            <span class="col-xs-3">
              <input type="text"
                     name="bdate[day]"
                     class="form-control"
                     id="usr-pass-form-bdate-day" placeholder="День">
            </span>
            <span class="col-xs-5">
              <select name="bdate[month]"
                      class="form-control col-xs-3"
                      id="usr-pass-form-bdate-month">
                <option value="1">Январь</option>
                <option value="2">Февраль</option>
                <option value="3">Март</option>
                <option value="4">Апрель</option>
                <option value="5">Май</option>
                <option value="6">Июнь</option>
                <option value="7">Июль</option>
                <option value="8">Август</option>
                <option value="9">Сентябрь</option>
                <option value="10">Октябрь</option>
                <option value="11">Ноябрь</option>
                <option value="12">Декабрь</option>
              </select>
            </span>
            <span class="col-xs-4">
              <input type="text"
                     name="bdate[year]"
                     class="form-control"
                     id="usr-pass-form-bdate-year"
                     placeholder="Год">
            </span>
          </span>
        </p>
        <p class="form-group usr-pass-form__email">
          <label for="usr-pass-form-email">Электронная почта</label>
          <input name="email" type="email" class="form-control" id="usr-pass-form-email" placeholder="mail@example.com">
        </p>
        <p class="form-group usr-pass-form__phone">
          <label for="usr-pass-form-phone">Мобильный телефон <span class="color-red">*</span></label>
          <input name="phone" type="text" class="form-control" id="usr-pass-form-phone" placeholder="+7 (9xx) xxx-xx-xx">
        </p>
        <p class="form-group usr-pass-form__phone">
          <label for="usr-pass-form-phone">Мобильный телефон <span class="color-red">*</span></label>
      <span class="input-group">
        <input name="phone" type="text" class="form-control" id="usr-pass-form-phone" placeholder="+7 (9xx) xxx-xx-xx">
        <span class="input-group-btn">
          <button class="btn btn-default" type="button">Подтвердить!</button>
        </span>
      </span>
        </p>
      </div>
    </div>
    <div class="usr-pass__section">
      <div class="usr-pass__section-left">

      </div>
      <div class="usr-pass__section-right">
        <p class="clearfix">
          <button type="submit" class="btn btn-primary pull-right">Сохранить</button>
        </p>
      </div>
    </div>
  </form>

</section>

<!-- //passport/content-content.tpl -->
