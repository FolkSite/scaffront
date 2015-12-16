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
                  class="uloc-list__item-action btn pull-right">
            Удалить
            {{ widget.icon({name: 'trash'}) }}
          </button>
        </span>
      </span>
    </form>
    {% endfor %}
  </div>
</div>
