/* ============================================================
   Mod Studio — поведение модальной формы «Get in touch»
   Открытие по иконке сообщения, валидация полей,
   закрытие по Cancel/Esc/клику по фону, экран успеха.
   ============================================================ */
(function () {
  var modal = document.getElementById('contact-modal');
  var form = document.getElementById('contact-form');
  var openButton = document.querySelector('.nav-message');

  if (!modal || !form || !openButton) {
    return;
  }

  var success = modal.querySelector('.modal-success');

  var fields = [
    {
      input: document.getElementById('contact-name'),
      error: document.getElementById('contact-name-error'),
      isValid: function (value) {
        return value.trim().length >= 3;
      },
      message: 'Enter at least 3 characters'
    },
    {
      input: document.getElementById('contact-email'),
      error: document.getElementById('contact-email-error'),
      isValid: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
      },
      message: 'Enter a valid e-mail, e.g. name@email.com'
    },
    {
      input: document.getElementById('contact-comment'),
      error: document.getElementById('contact-comment-error'),
      isValid: function (value) {
        return value.trim().length > 0;
      },
      message: 'Write your message'
    }
  ];

  function setFieldState(field, valid) {
    var wrap = field.input.closest('.modal-input-wrap');

    wrap.classList.toggle('is-invalid', !valid);
    field.input.setAttribute('aria-invalid', String(!valid));
    field.error.textContent = valid ? '' : field.message;
  }

  function validateField(field) {
    var valid = field.isValid(field.input.value);

    setFieldState(field, valid);

    return valid;
  }

  function resetForm() {
    form.reset();

    fields.forEach(function (field) {
      setFieldState(field, true);
    });

    form.hidden = false;
    success.hidden = true;
  }

  function openModal() {
    resetForm();
    modal.showModal();
    fields[0].input.focus();
  }

  function closeModal() {
    modal.close();
  }

  openButton.addEventListener('click', openModal);

  modal.querySelectorAll('[data-modal-close]').forEach(function (button) {
    button.addEventListener('click', closeModal);
  });

  /* Закрытие по клику на затемнённый фон (сам <dialog>, не его содержимое) */
  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  fields.forEach(function (field) {
    field.input.addEventListener('blur', function () {
      if (field.input.value !== '') {
        validateField(field);
      }
    });

    field.input.addEventListener('input', function () {
      if (field.input.closest('.modal-input-wrap').classList.contains('is-invalid')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    /* Валидируем все поля (не find: он остановился бы на первом невалидном) */
    var invalidFields = fields.filter(function (field) {
      return !validateField(field);
    });

    if (invalidFields.length > 0) {
      invalidFields[0].input.focus();
      return;
    }

    form.hidden = true;
    success.hidden = false;
    success.focus();
  });
})();
