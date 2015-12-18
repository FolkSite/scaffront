<!-- locations/content-content.tpl -->

<section class="user-locations">
  {% set hasLocations = false %}
  {% if userLocations|_isArray and userLocations|_size %}
    {% set hasLocations = true %}
  {% endif %}

  <div class="user-locations__add-intro uloc-add-intro">
    <p class="uloc-add-intro__icon">
      <i class="icon icon--globus-question"></i>
    </p>
    <h2 class="uloc-add-intro__title">Добавьте город</h2>
    <p class="uloc-add-intro__description">
      область или регион, чтобы получать информацию <br>
      о новых заданиях рядом с вами
    </p>
  </div>

  <form method="post"
        class="user-locations__form uloc-form">
    <p class="asides">
    <span class="asides__right">
      <button type="submit"
              class="uloc-form__action btn btn-primary">Добавить</button>
    </span>
    <span class="asides__center">
      <input name="text"
             type="text"
             class="uloc-form__input-text form-control"
             placeholder="Название города, области или региона">
    </span>
    </p>
  </form>

  <div class="user-locations__list uloc-list panel">
    <h2 class="uloc-list__title">Мои локации</h2>
    <div class="uloc-list__items">
      {% for index, location in userLocations %}
        <form method="post" class="uloc-list__item">
          <input type="hidden" name="id" value="{{ location.id }}">
          <span class="asides">
            <span class="asides__left">
              <span class="uloc-list__item-title">{{ location.title }}</span>
            </span>
            <span class="asides__right">
              <button type="submit"
                      name="action"
                      value="user/locations/delete"
                      class="uloc-list__item-action">
                Удалить
                {{ widget.icon({name: 'trash'}) }}
              </button>
            </span>
          </span>
        </form>
      {% endfor %}
    </div>
  </div>
</section>

<!-- //locations/content-content.tpl -->