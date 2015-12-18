<div class="user-skill usr-skl {{ classes }}">
  <form class="usr-skl__header" method="post">
    <span class="usr-skl__icon">
      {{ widget.userAvatar({url: avatar_url, name: 'Никита Ласточкин'})}}
      {{ widget.icon({name: 'skills-courier', classes: ''}) }}
    </span>
    <span class="asides">
      <span class="asides__right">
        <span class="usr-skl__actions">
          <button class="btn btn-transparent">Удалить</button>
        </span>
      </span>
      <span class="asides__center">
        <span class="usr-skl__name">Курьер</span>
      </span>
    </span>
  </form>
  <div class="usr-skl__content usr-skl-cnt">
    <div class="usr-skl__docs usr-skl-docs">
      <div class="usr-skl-cnt__description">
        <h4>Прикрепленные документы</h4>
        <p>Прикрепите соответствующие документы, чтобы подтвердить ваши профессиональные навыки.
          При запросе специализации «Электрик» копии удостоверения и допуск по разряду обязательны.</p>
      </div>
      <div class="usr-skl-docs__title row">
        <span class="col col-sm-7">Имя файла</span>
        <span class="col col-sm-5">Тип документа</span>
      </div>
      <div class="usr-skl-docs__list">
        {% include './skill-doc.tpl' %}
        {% include './skill-doc.tpl' %}
        {% include './skill-doc.tpl' %}
      </div>
      <div class="usr-skl-docs__add">
        Перетащите сюда или <a href="#">выберите файлы</a>
      </div>
    </div>
  </div>
</div>
