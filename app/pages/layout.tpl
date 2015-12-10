<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title>{{ title }} | WowWorks</title>

    {% block Head %}
      {% include './layout/head.tpl' %}
    {% endblock %}

    {% block Styles %}
      {% include './layout/styles.tpl' %}
    {% endblock %}

  </head>
  <body>

    <!--[if lt IE 8]>
    <p class="browserupgrade">У вас <strong>очень</strong> старый браузер. Пожалуйста, <a href="http://browsehappy.com/">обновите его</a>, чтобы вкусить все прелести современного интернета.</p>
    <![endif]-->

    <div class="layout layout--default">
      {% block Header %}
        <header class="layout__header">
          <div class="layout__width">
            <div class="layout__width-inner">
              {% block Header-content %}{% endblock %}
            </div>
          </div>
        </header>
      {% endblock %}

      <div class="layout__middle">
        {% block Content %}
          <div class="layout__content-container">
            <main class="layout__content" role="main">
              {% block Content-content %}
                sdf
              {% endblock %}
            </main>
          </div>
        {% endblock %}

        {% block SidebarLeft %}
          <aside class="layout__sidebar layout__sidebar--left">
            {% block SidebarLeft.content %}{% endblock %}
          </aside>
        {% endblock %}

        {% block SidebarRight %}
          <aside class="layout__sidebar layout__sidebar--right">
            {% block SidebarRight.content %}{% endblock %}
          </aside>
        {% endblock %}
      </div>
    </div>

    {% block Footer %}
      <footer class="layout__footer">
        {% block Footer-content %}{% endblock %}
      </footer>
    {% endblock %}

    {% block Scripts %}
      {% include './layout/scripts.tpl' %}
    {% endblock %}

  </body>
</html>