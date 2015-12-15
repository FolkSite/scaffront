{% extends '../tpls/default.tpl' %}
{% import '../macros/user.tpl' as user %}
{% import '../macros/page.tpl' as page %}

{% block layout-type %}user{% endblock %}

{% block Body-before %}{% endblock %}

{% block Menu-content %}
  это меню
{% endblock %}

{% block Header-before %}{% endblock %}
{% block Header-content %}
  {#header#}
  {% include './chunks/layout-menu.tpl' %}

{% endblock %}
{% block Header-after %}{% endblock %}

{% block Middle-before %}{% endblock %}

{% block Content-content %}
  {#content#}

  {{ page.title(user.avatar(avatar) +'Никита Ласточкин') }}

  {% include './chunks/page-menu.tpl' %}

  <section class="user-location-add">
    <div class="user-location-add__content">
      <p class="user-location-add__icon">
        <i class="icon icon--globus-question"></i>
      </p>
      <h2 class="user-location-add__title">Добавьте город</h2>
      <p class="user-location-add__description">
        область или регион, чтобы получать информацию <br>
        о новых заданиях рядом с вами
      </p>
    </div>

    <div class="user-location-add__form">
      <form method="post">
        <p class="asides">
          <span class="asides__right">
            <button type="submit"
                    class="btn btn--primary btn--lg">Добавить</button>
          </span>
          <span class="asides__center">
            <input name="text"
                   type="text"
                   class="user-location-add__input-text input input--default input--lg input--full"
                   placeholder="Название города, области или региона">
          </span>
        </p>
      </form>
    </div>

  </section>


{% endblock %}

{% block Sidebar-left %}{% endblock %}
{% block Sidebar-right %}{% endblock %}

{% block Middle-after %}{% endblock %}

{% block Footer-before %}{% endblock %}
{% block Footer %}
  {#footer#}



{% endblock %}
{% block Footer-after %}{% endblock %}

{% block Body-after %}{% endblock %}
