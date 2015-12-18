<!-- _layouts/user/content-content-before.tpl -->

<h1 class="page__title">
  {{ widget.userAvatar({url: avatar_url, name: 'Никита Ласточкин'})}} Никита Ласточкин
</h1>

<nav class="page__menu">
  {{ widget.tabs({
    items: pageMenu,
    needContent: false
  }) }}
</nav>

<!-- //_layouts/user/content-content-before.tpl -->