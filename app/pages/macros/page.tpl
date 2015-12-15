{% macro title(content) %}
  {% autoescape false %}

  {% spaceless %}
  <h1 class="page__title">
      {{ content }}
  </h1>
  {% endspaceless %}

  {% endautoescape %}
{% endmacro %}
