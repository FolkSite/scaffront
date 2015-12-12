{% extends './layout.tpl' %}

{% block Header-content %}
  Шапка
{% endblock %}

{% block Content-content %}
<p class="test test1">
  Обычный. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, eius?
  <a href="#">Это ссылка</a>
</p>
<p class="test test2">
  Исходный bold. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, eius?
  <a href="#">Это ссылка</a>
</p>
<p class="test test3">
  Браузерный bold. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, eius?
  <a href="#">Это ссылка</a>
</p>
<p class="test test4">
  Исходный italic. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, eius?
  <a href="#">Это ссылка</a>
</p>
<p class="test test5">
  Браузерный italic. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, eius?
  <a href="#">Это ссылка</a>
</p>
<p class="test test6">
  Исходный bold italic. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, eius?
  <a href="#">Это ссылка</a>
</p>
<p class="test test7">
  Браузерный bold italic. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt, eius?
  <a href="#">Это ссылка</a>
</p>
{% endblock %}

{% block Footer-content %}
  Футер
{% endblock %}

{% block SidebarLeft %}{% endblock %}
{% block SidebarRight %}{% endblock %}

