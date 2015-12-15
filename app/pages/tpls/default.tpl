<!doctype html>
<html lang="ru">
  <head>
    {% block Head %}

      {% block Meta %}
        {% include './default/meta.tpl' %}
        {% include './default/favicons.tpl' %}
      {% endblock %} {# //Meta #}

      {% block Styles %}
        {% include './default/styles.tpl' %}
      {% endblock %} {# //Styles #}

      <title>{{ title }} | WowWorks</title>

    {% endblock %} {# //Head #}
  </head>
  <body>
    {% block Body-before %}{% endblock %}

    {% block Body %}

      <div class="layout {% spaceless %}layout--{% block layout-type %}{% endblock %}{% endspaceless %}">

        {% block Menu %}
          <section class="layout__menu">
            <div class="layout__width">
              <div class="layout__width-inner">
                <div class="layout__menu-inner">
                  <nav class="nav-bar">
                    <div class="nav-bar__left">
                      <a href="/" class="nav-bar__logo logo">
                        <img src="/images/logo@2x.png">
                      </a>
                    </div>
                    <div class="nav-bar__right"></div>
                    <div class="nav-bar__center">
                      {% block Menu-content %}
                        {% include './default/chunks/layout-menu.tpl' %}
                      {% endblock %}
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </section>
        {% endblock %} {# //Menu #}

        {% block Header-before %}{% endblock %}

        {% block Header %}
          <header class="layout__header">
            <div class="layout__width">
              <div class="layout__width-inner">
                <div class="layout__header-inner">
                  {% block Header-content %}{% endblock %}
                </div>
              </div>
            </div>
          </header>
        {% endblock %} {# //Header #}

        {% block Header-after %}{% endblock %}
        {% block Middle-before %}{% endblock %}

        {% block Middle %}
          <div class="layout__middle">
            <div class="layout__width">
              <div class="layout__width-inner">
                <div class="layout__middle-inner">
                  {% block Middle-content %}
                    {% block Content %}
                    <div class="layout__content">
                      <main class="layout__content-inner page" role="main">
                        {% include './default/oldbrowser.tpl' %}
                        {% block Content-content %}{% endblock %}
                      </main>
                    </div>
                    {% endblock %} {# //Content #}

                    {% block Sidebar-left %}
                      <aside class="layout__sidebar layout__sidebar--left">
                        {% block Sidebar-left-content %}{% endblock %}
                      </aside>
                    {% endblock %} {# //Sidebar-left #}

                    {% block Sidebar-right %}
                      <aside class="layout__sidebar layout__sidebar--right">
                        {% block Sidebar-right-content %}{% endblock %}
                      </aside>
                    {% endblock %} {# //Sidebar-right #}
                  {% endblock %} {# //Middle-content #}
                </div>
              </div>
            </div>
          </div>
        {% endblock %} {# //Middle #}

        {% block Middle-after %}{% endblock %}
        {% block Footer-before %}{% endblock %}

        {% block Footer %}
          <footer class="layout__footer">
            <div class="layout__width">
              <div class="layout__width-inner">
                <div class="layout__footer-inner">
                  {% block Footer-content %}{% endblock %}
                </div>
              </div>
            </div>
          </footer>
        {% endblock %} {# //Footer #}

        {% block Footer-after %}{% endblock %}
      </div>

    {% endblock %} {# //Body #}

    {% block Body-after %}{% endblock %}

    {% block Scripts %}
      {% include './default/scripts.tpl' %}
    {% endblock %} {# //Scripts #}
  </body>
</html>