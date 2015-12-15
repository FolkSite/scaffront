<!doctype html>
<html lang="ru">
  <head>
    {% block Head %}

      {% block Meta %}
        {% include '../chunks/meta.tpl' %}
      {% endblock %} {# //Meta #}

      {% block Styles %}
        {% include '../chunks/styles.tpl' %}
      {% endblock %} {# //Styles #}

      <title>{{ title }} | WowWorks</title>

    {% endblock %} {# //Head #}
  </head>
  <body>
    {% block Body %}

    <div class="layout {% spaceless %}layout--{% block layout-type %}{% endblock %}{% endspaceless %}">
      {% block Header-before %}{% endblock %}

      {% block Header %}
      <header class="layout__header">
        <div class="layout__width">
          <div class="layout__width-inner">
            {% block Header-content %}{% endblock %}
          </div>
        </div>
      </header>
      {% endblock %} {# //Header #}

      {% block Header-after %}{% endblock %}
      {% block Middle-before %}{% endblock %}

      {% block Middle %}
      <div class="layout__width">
        <div class="layout__width-inner">
          <div class="layout__middle">
            {% block Content %}
              {% include '../chunks/oldbrowser.tpl' %}
              <div class="layout__content-container">
                <main class="layout__content" role="main">
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
              {% block Footer-content %}{% endblock %}
            </div>
          </div>
        </footer>
      {% endblock %} {# //Footer #}

      {% block Footer-after %}{% endblock %}
    </div>

    {% endblock %} {# //Body #}

    {% block Scripts %}
      {% include '../chunks/scripts.tpl' %}
    {% endblock %} {# //Scripts #}
  </body>
</html>