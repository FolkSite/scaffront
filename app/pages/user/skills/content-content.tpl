<!-- skills/content-content.tpl -->

<section class="user-skills usr-skls">

  <h2 class="usr-skls__title">Мои навыки</h2>

  <div class="usr-skls__section usr-skls-sect">
    <div class="usr-skls__list is-approved">
      {% include './chunks/skill.tpl' with {classes: 'is-expanded'} %}
      {% include './chunks/skill.tpl' %}
      {% include './chunks/skill.tpl' %}
    </div>

  </div>

  <div class="usr-skls__section usr-skls-sect">
    <h3 class="usr-skls-sect__title">На рассмотрении</h3>

    <div class="usr-skls__list is-consideration">
      {% include './chunks/skill.tpl' %}
      {% include './chunks/skill.tpl' with {classes: 'is-expanded'} %}
      {% include './chunks/skill.tpl' %}
      {% include './chunks/skill.tpl' %}
    </div>

  </div>

  <div class="usr-skls__section usr-skls-sect">
    <h3 class="usr-skls-sect__title">Не подтвержденные</h3>

    <div class="usr-skls__list is-not-approved">
      {% include './chunks/skill.tpl' %}
      {% include './chunks/skill.tpl' %}
      {% include './chunks/skill.tpl' with {classes: 'is-expanded'} %}
    </div>

  </div>

</section>

<!-- //skills/content-content.tpl -->