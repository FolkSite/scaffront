{% extends './default.tpl' %}

{% block layout-type %}layout--auth{% endblock %}

{#{% block Head %}{% endblock %}#}
  {#{% block Meta %}{% endblock %}#}
  {#{% block Styles %}{% endblock %}#}

{#{% block Body-before %}{% endblock %}#}

{#{% block Body %}{% endblock %}#}
  {% block Menu %}{% endblock %}
    {#{% block Menu-content %}{% endblock %}#}

  {% block Header-before %}
    <div class="layout--auth__bg" style="background-image: url('{{ background.image }}')"></div>
  {% endblock %}

  {#{% block Header %}{% endblock %}#}
    {% block Header-content %}
      <a href="/" class="logo">
        <img src="/images/logo@2x.png">
      </a>
    {% endblock %}

  {#{% block Header-after %}{% endblock %}#}

  {#{% block Middle-before %}{% endblock %}#}

  {#{% block Middle %}{% endblock %}#}
    {#{% block Middle-content %}{% endblock %}#}

      {#{% block Content %}{% endblock %}#}
        {#{% block Content-content-before %}{% endblock %}#}
        {#{% block Content-content %}{% endblock %}#}
        {#{% block Content-content-after %}{% endblock %}#}

      {% block Sidebar-left %}{% endblock %}
        {#{% block Sidebar-left-content %}{% endblock %}#}

      {% block Sidebar-right %}{% endblock %}
        {#{% block Sidebar-right-content %}{% endblock %}#}

  {#{% block Middle-after %}{% endblock %}#}

  {#{% block Footer-before %}{% endblock %}#}

  {#{% block Footer %}{% endblock %}#}
    {% block Footer-content %}
      <p class="layout--auth__bg-copyright la-bg-copyright">
        <span class="la-bg-copyright__title">{{ background.title }}</span>
        <span class="la-bg-copyright__author">&copy; {{ background.author }}</span>
      </p>
    {% endblock %}

  {#{% block Footer-after %}{% endblock %}#}

{#{% block Body-after %}{% endblock %}#}

{#{% block Scripts %}{% endblock %}#}
