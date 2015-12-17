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

<section class="user-locations">
  {% set hasLocations = false %}
  {% if userLocations|isArray and userLocations|size %}
    {% set hasLocations = true %}
  {% endif %}

  {% include './locations/add-intro.tpl' %}

  {% include './locations/add-form.tpl' %}

  {% include './locations/list.tpl' %}
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
