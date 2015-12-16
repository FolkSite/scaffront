{% macro title(content) %}
  {% autoescape false %}
  {% spaceless %}

  <h1 class="page__title">
      {{ content }}
  </h1>

  {% endspaceless %}
  {% endautoescape %}
{% endmacro %}

{% macro icon(name, svg) %}
  {% spaceless %}
    {% if name %}
      {% if svg %}

      {% else %}

        <i class="icon icon--{{ name }}"></i>

      {% endif %}
    {% endif %}

  {% endspaceless %}
{% endmacro %}
