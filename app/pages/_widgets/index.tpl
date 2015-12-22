{% macro icon(config) %}
  <!-- widget 'icon' -->
  {% set config = config|defaults({
    name: '',
    svg: false,
    classes: ''
  }) %}

  {% spaceless %}
    {% if config.name %}
      {% if config.svg %}

      {% else %}
        <i class="icon icon--{{ config.name }} {{ config.classes }}"></i>
      {% endif %}
    {% endif %}

  {% endspaceless %}
  <!-- //widget 'icon' -->
{% endmacro %}


{% macro userAvatar(config) %}
  {% set config = config|defaults({
    url: '',
    name: '',
    width: '',
    classes: ''
  }) %}
  <!-- widget 'userAvatar' -->
  {% if config.url %}
    <i class="avatar {{ config.classes }}" style="background-image: url('{{ config.url }}'); {% if config.width %}width: {{ config.width }};{% endif %}">
      <img src="{{ config.url }}" alt="{{ config.name }}">
    </i>
  {% endif %}
  <!-- //widget 'userAvatar' -->
{% endmacro %}


{% macro badge(config) %}
  <!-- widget 'badge' -->
  {% set config = config|defaults({
    content: '',
    classes: ''
  }) %}

  {% if config.content %}
    <span class="badge {{ config.classes }}">{{ config.content|safe }}</span>
  {% endif %}
  <!-- //widget 'badge' -->
{% endmacro %}


{% macro tabs(config) %}
  <!-- widget 'tabs' -->
  {% set config = config|defaults({
    needNav: true,
    needContent: true,
    classes: '',
    classesNav: 'tabs__nav--bordered badges-bottom',
    classesContent: ''
  }) %}

  {% if config.items|_isArray and config.items|_size %}
    <div class="tabs">

      {% if config.needNav %}
      <ul class="tabs__nav {{ config.classesNav }}">
        {% for index, item in config.items %}
          <li data-tabs-index="{{ index + 1 }}"
              class="tabs__nav-item {% if item.isActive %}is-active{% endif %} {{ item.classes }}">
            <a href="{{ item.href }}" class="tabs__nav-link">
              <span class="tabs__nav-link-inner">{{ item.title }}</span>

              {% if item.badge|_isPlainObject %}
                {% set badgeClasses = '' %}
                {% if item.badge.isActive %}
                  {% set badgeClasses = 'is-active' %}
                {% endif %}

                {{ badge({
                  content: item.badge.content,
                  classes: badgeClasses
                }) }}
              {% endif %}
            </a>
          </li>
        {% endfor %}
      </ul>
      {% endif %}

      {% if config.needContent %}
      <div class="tabs__content {{ config.classesContent }}">
        {% for index, item in config.items %}
          <div data-tabs-index="{{ index + 1 }}"
               class="tabs__pane {% if item.isActive %}is-active{% endif %}">
            {{ item.content }}
          </div>
        {% endfor %}
      </div>
      {% endif %}

    </div>
  {% endif %}
  <!-- //widget 'tabs' -->
{% endmacro %}
