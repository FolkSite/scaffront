<!-- profile/content-content.tpl -->

<section class="user-profile usr-prof">

  <form class="usr-prof__form usr-prof-form" method="post">
    <div class="usr-prof__section">
      <div class="usr-prof__section-left usr-prof-form__avatar">
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
      <div class="usr-prof__section-right usr-prof-form__fields">
        <p class="form-group usr-prof-form__firstname">
          <label for="usr-prof-form-firstname">Имя <span class="color-red">*</span></label>
          <input name="firstname" type="text" class="form-control" id="usr-prof-form-firstname" placeholder="Никита">
        </p>
        <p class="form-group usr-prof-form__lastname">
          <label for="usr-prof-form-lastname">Фамилия <span class="color-red">*</span></label>
          <input name="lastname" type="text" class="form-control" id="usr-prof-form-lastname" placeholder="Фамилия">
        </p>
        <p class="form-group usr-prof-form__thirdname">
          <label for="usr-prof-form-thirdname">Отчество <span class="color-red">*</span></label>
          <input name="thirdname" type="text" class="form-control" id="usr-prof-form-thirdname" placeholder="Отчество">
        </p>
        <p class="form-group usr-prof-form__bdate">
          <label for="usr-prof-form-bdate">День рождения <span class="color-red">*</span></label>
          <span class="usr-prof-form__bdate row">
            <span class="col-xs-3">
              <input type="text"
                     name="bdate[day]"
                     class="form-control"
                     id="usr-prof-form-bdate-day" placeholder="День">
            </span>
            <span class="col-xs-5">
              <select name="bdate[month]"
                      class="form-control col-xs-3"
                      id="usr-prof-form-bdate-month">
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
                     id="usr-prof-form-bdate-year"
                     placeholder="Год">
            </span>
          </span>
        </p>
        <p class="form-group usr-prof-form__email">
          <label for="usr-prof-form-email">Электронная почта</label>
          <input name="email" type="email" class="form-control" id="usr-prof-form-email" placeholder="mail@example.com">
        </p>
        <p class="form-group usr-prof-form__phone">
          <label for="usr-prof-form-phone">Мобильный телефон <span class="color-red">*</span></label>
          <input name="phone" type="text" class="form-control" id="usr-prof-form-phone" placeholder="+7 (9xx) xxx-xx-xx">
        </p>
        <p class="form-group usr-prof-form__phone">
          <label for="usr-prof-form-phone">Мобильный телефон <span class="color-red">*</span></label>
          <span class="input-group">
            <input name="phone" type="text" class="form-control" id="usr-prof-form-phone" placeholder="+7 (9xx) xxx-xx-xx">
            <span class="input-group-btn">
              <button class="btn btn-default" type="button">Подтвердить!</button>
            </span>
          </span>
        </p>
      </div>
    </div>
    <div class="usr-prof__section">
      <div class="usr-prof__section-left">

      </div>
      <div class="usr-prof__section-right">
        <p class="clearfix">
          <button type="submit" class="btn btn-primary pull-right">Сохранить</button>
        </p>
      </div>
    </div>
  </form>

</section>

<!-- //profile/content-content.tpl -->