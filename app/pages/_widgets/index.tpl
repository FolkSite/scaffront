{% macro pageTitle(content) %}
  <!-- widget 'pageTitle' -->
  {% autoescape false %}
    {% spaceless %}

      <h1 class="page__title">
        {{ content }}
      </h1>

    {% endspaceless %}
  {% endautoescape %}
  <!-- //widget 'pageTitle' -->
{% endmacro %}


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


{% macro userAvatar(url, name, width) %}
  <!-- widget 'userAvatar' -->
  <span class="avatar" style="background-image: url('{{ url }}'); {% if width %}width: {{ width }};{% endif %}">
    <img src="{{ url }}" alt="{{ name }}">
  </span>
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

  {% if config.items|isArray and config.items|size %}
    <div class="page__menu tabs">

      {% if config.needNav %}
      <ul class="tabs__nav {{ config.classesNav }}">
        {% for index, item in config.items %}
          <li data-tabs-index="{{ index + 1 }}"
              class="tabs__nav-item {% if item.isActive %}is-active{% endif %}">
            <a href="{{ item.href }}" class="tabs__nav-link">
              <span class="tabs__nav-link-inner">{{ item.title }}</span>

              {% if item.badge|isPlainObject %}
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

