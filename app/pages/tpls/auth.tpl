{% extends './default.tpl' %}

{% block layout-type %}auth{% endblock %}

{% block Header-before %}
  <div class="layout--auth__bg" style="background-image: url('{{ background.image }}')"></div>
{% endblock %}

{% block Header-content %}
  <a href="/" class="logo">
    <img src="/images/logo@2x.png">
  </a>
{% endblock %}

{% block Footer-content %}
{% autoescape false %}
<p class="bg-copyright">
  <span class="bg-copyright__title">{{ background.title }}</span>
  <span class="bg-copyright__author">&copy; {{ background.author }}</span>
</p>
{% endautoescape %}
{% endblock %}

{% block Sidebar-left %}{% endblock %}
{% block Sidebar-right %}{% endblock %}
