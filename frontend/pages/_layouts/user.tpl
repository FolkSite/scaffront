{% extends './default.tpl' %}

{% block layout-type %}{% endblock %}

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
        {% block Content-content-before %}
{% include './user/content-content-before.tpl' %}
        {% endblock %}
        {#{% block Content-content %}{% endblock %}#}
        {#{% block Content-content-after %}{% endblock %}#}

      {% block Sidebar-left %}{% endblock %}
        {#{% block Sidebar-left-content %}{% endblock %}#}

      {% block Sidebar-right %}{% endblock %}
        {#{% block Sidebar-right-content %}{% endblock %}#}

  {#{% block Middle-after %}{% endblock %}#}

  {#{% block Footer-before %}{% endblock %}#}

  {#{% block Footer %}{% endblock %}#}
    {#{% block Footer-content %}{% endblock %}#}

  {#{% block Footer-after %}{% endblock %}#}

{#{% block Body-after %}{% endblock %}#}

{#{% block Scripts %}{% endblock %}#}
