{% extends './tpls/auth.tpl' %}

{% block Content %}
  <div class="auth auth--registration">
    <h1 class="auth__title">Регистрация исполнителя</h1>
    <p>
      <input type="text"
             name="phone"
             placeholder="Мобильный телефон"
             class="auth__field input input--default input--full input--lg">
      <input type="text"
             name="password"
             placeholder="Пароль"
             class="auth__field input input--default input--full input--lg">
    </p>
    <p>
      <button type="submit" class="auth__submit btn btn--primary btn--full btn--lg">Зарегистрироваться</button>
    </p>
    <p class="auth__description">
      Нажимая на кнопку «Зарегистрироваться», вы подтверждаете свое согласие с условиями
      <a href="#">публичной оферты</a>
    </p>
    <p class="text-center">или зарегистрироваться через</p>
    <p class="auth__socials">
      <a class="auth__social" href="#">
        <i class="icon icon--social-vk"></i>
      </a>
      <a class="auth__social" href="#">
        <i class="icon icon--social-ok"></i>
      </a>
      <a class="auth__social" href="#">
        <i class="icon icon--social-mail"></i>
      </a>
    </p>
  </div>
  <br>
  <p class="text-center">
    <a href="#" class="link link--white">Зарегистрированы?</a>
  </p>

{% endblock %}
