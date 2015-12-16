{% extends '../_layouts/default.tpl' %}
{% import '../_macros/user.tpl' as user %}
{% import '../_macros/page.tpl' as page %}

{% block layout-type %}user{% endblock %}

{% block Body-before %}{% endblock %}

{% block Menu-content %}
  {% include './chunks/layout-menu.tpl' %}
{% endblock %}

{% block Header-before %}{% endblock %}

{% block Header-content %}{% endblock %}

{% block Header-after %}{% endblock %}

{% block Middle-before %}{% endblock %}

{% block Content-content %}
  {#content#}

  {{ page.title(user.avatar(avatar) +'Никита Ласточкин') }}

  {% include './chunks/page-menu.tpl' %}

  <section class="user-locations">
    <div class="user-locations__add-intro uloc-add-intro">
      <p class="uloc-add-intro__icon">
        <i class="icon icon--globus-question"></i>
      </p>
      <h2 class="uloc-add-intro__title">Добавьте город</h2>
      <p class="uloc-add-intro__description">
        область или регион, чтобы получать информацию <br>
        о новых заданиях рядом с вами
      </p>
    </div>

    <div class="user-locations__form uloc-form">
      <form method="post">
        <p class="asides">
          <span class="asides__right">
            <button type="submit"
                    class="btn btn--primary btn--lg">Добавить</button>
          </span>
          <span class="asides__center">
            <input name="text"
                   type="text"
                   class="uloc-form__input-text input input--default input--lg input--full"
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
