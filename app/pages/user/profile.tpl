{% extends '../_layouts/user.tpl' %}

{#{% block layout-type %}{% endblock %}#}

{#{% block Head %}{% endblock %}#}
  {#{% block Meta %}{% endblock %}#}
  {#{% block Styles %}{% endblock %}#}

{#{% block Body-before %}{% endblock %}#}

{#{% block Body %}{% endblock %}#}
  {#{% block Menu %}{% endblock %}#}
    {#{% block Menu-content %}{% endblock %}#}

  {#{% block Header-before %}{% endblock %}#}

  {#{% block Header %}{% endblock %}#}
    {#{% block Header-content %}{% endblock %}#}

  {#{% block Header-after %}{% endblock %}#}

  {#{% block Middle-before %}{% endblock %}#}

  {#{% block Middle %}{% endblock %}#}
    {#{% block Middle-content %}{% endblock %}#}

      {#{% block Content %}{% endblock %}#}
        {#{% block Content-content-before %}{% endblock %}#}
        {% block Content-content %}

<section class="user-profile">

  <form class="user-profile__form uprof-form" method="post">
    <div class="uprof-form__section">
      <div class="uprof-form__section-left uprof-form__avatar">
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
      <div class="uprof-form__section-right uprof-form__fields">
        <p class="form-group uprof-form__firstname">
          <label for="uprof-form-firstname">Имя <span class="color-red">*</span></label>
          <input name="firstname" type="text" class="form-control" id="uprof-form-firstname" placeholder="Никита">
        </p>
        <p class="form-group uprof-form__lastname">
          <label for="uprof-form-lastname">Фамилия <span class="color-red">*</span></label>
          <input name="lastname" type="text" class="form-control" id="uprof-form-lastname" placeholder="Фамилия">
        </p>
        <p class="form-group uprof-form__thirdname">
          <label for="uprof-form-thirdname">Отчество <span class="color-red">*</span></label>
          <input name="thirdname" type="text" class="form-control" id="uprof-form-thirdname" placeholder="Отчество">
        </p>
        <p class="form-group uprof-form__bdate">
          <label for="uprof-form-bdate">День рождения <span class="color-red">*</span></label>
      <span class="uprof-form__bdate row block">
        <span class="col-xs-3">
          <input type="text"
                 name="bdate[day]"
                 class="form-control"
                 id="uprof-form-bdate-day" placeholder="День">
        </span>
        <span class="col-xs-5">
          <select name="bdate[month]"
                  class="form-control col-xs-3"
                  id="uprof-form-bdate-month">
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
                 id="uprof-form-bdate-year"
                 placeholder="Год">
        </span>
      </span>
        </p>
        <p class="form-group uprof-form__email">
          <label for="uprof-form-email">Электронная почта</label>
          <input name="email" type="email" class="form-control" id="uprof-form-email" placeholder="mail@example.com">
        </p>
        <p class="form-group uprof-form__phone">
          <label for="uprof-form-phone">Мобильный телефон <span class="color-red">*</span></label>
          <input name="phone" type="text" class="form-control" id="uprof-form-phone" placeholder="+7 (9xx) xxx-xx-xx">
        </p>
        <p class="form-group uprof-form__phone">
          <label for="uprof-form-phone">Мобильный телефон <span class="color-red">*</span></label>
      <span class="input-group">
        <input name="phone" type="text" class="form-control" id="uprof-form-phone" placeholder="+7 (9xx) xxx-xx-xx">
        <span class="input-group-btn">
          <button class="btn btn-default" type="button">Подтвердить!</button>
        </span>
      </span>
        </p>
      </div>
    </div>
    <div class="uprof-form__section">
      <div class="uprof-form__section-left">

      </div>
      <div class="uprof-form__section-right">
        <p class="clearfix">
          <button type="submit" class="btn btn-primary pull-right">Сохранить</button>
        </p>
      </div>
    </div>
  </form>

</section>

        {% endblock %}
        {#{% block Content-content-after %}{% endblock %}#}

      {#{% block Sidebar-left %}{% endblock %}#}
        {#{% block Sidebar-left-content %}{% endblock %}#}

      {#{% block Sidebar-right %}{% endblock %}#}
        {#{% block Sidebar-right-content %}{% endblock %}#}

  {#{% block Middle-after %}{% endblock %}#}

  {#{% block Footer-before %}{% endblock %}#}

  {#{% block Footer %}{% endblock %}#}
    {#{% block Footer-content %}{% endblock %}#}

  {#{% block Footer-after %}{% endblock %}#}

{#{% block Body-after %}{% endblock %}#}

{#{% block Scripts %}{% endblock %}#}
