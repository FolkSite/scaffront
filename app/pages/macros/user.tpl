{% macro avatar(url, name, width) %}
  <span class="avatar" style="background-image: url('{{ url }}'); {% if width %}width: {{ width }};{% endif %}">
    <img src="{{ url }}" alt="{{ name }}">
  </span>
{% endmacro %}
