'use strict';
// ===========
// в этом блоке определяем глобальные константы

const page = document.querySelector('.page');
const accordeonList = document.querySelectorAll('.accordeon');
const accordeonControlList = document.querySelectorAll('.accordeon__control');
const smoothLink = document.querySelector('.hello__link');
const callRequest = document.querySelector('.header__button--call-request');
const phonePattern = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/;
const feedbackForm = document.forms.feedback;

const userInfo = {
  userName: '',
  userPhone: '',
  userQuestion: ''
};

// ===========
// служебные проверки

const isEscape = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

// =======
//  аккордеон

const switchAccordeon = (evt) => {
  // Функция открытия/закрытия аккордеонов
  // завязано на разметку - обязательно смотреть разметку
  // получаем  target - объект на который нажали - это кнопка внутри аккордеона
  const target = evt.target;
  // поднимаемся выше - находим заголовок аккордеона - там его "идентификатор" в data-атрибуте 'accordeonid'
  const accordeonTarget = target.closest('.accordeon');
  // получаем "идентификатор" аккордеона на который нажали
  const accordeonTargetId = accordeonTarget.dataset.accordeonid;
  // конструируем селектор, который идентифицирует наш аккордеон
  const targetId = `accordeon--${accordeonTargetId}`;

  // проходимся по списку аккордеонов (определен в глобальных переменных)
  for (let i = 0; i < accordeonList.length; i++) {
    // если аккордеон открыт и это "чужой аккордеон" - просто закрываем его
    if ((accordeonList[i].classList.contains('accordeon--open')) && (!accordeonList[i].classList.contains(targetId))) {
      accordeonList[i].classList.remove('accordeon--open');
      // если это наш аккордеон - меняет ему класс
    } else if (accordeonList[i].classList.contains(targetId)) {
      accordeonList[i].classList.toggle('accordeon--open');
    }
  }
}

// вешаем addEventListener на все контролы аккордеонов
if (accordeonControlList) {
  accordeonControlList.forEach((listItem) => {
    listItem.addEventListener('click', switchAccordeon)
  })
}

// =================
// Функция плавной прокрутки - переход по идентификаторам
// перечень smoothLink - ссылок, при нажатии на которые должна быть плавная прокрутка, определен глобально
if (smoothLink) {
  for (let i = 0; i < smoothLink.length; i++) {
    // для каждой ссылки
    let menuItem = smoothLink[i];
    // определяем идентификатор, на который она ссылается
    // substring(1) - отрезает первый символ
    let sectionId = smoothLink.getAttribute('href').substring(1);

    // и на эту ссыдку вешаем addEventListener
    menuItem.addEventListener('click', function (evt) {
      // который отменяет действие по умоланию
      evt.preventDefault();

      // получает элемент по идентификатору и перемещается к нему (scrollIntoView)
      // поведение - плавная прокрутка behavior: 'smooth'
      document.getElementById(sectionId).scrollIntoView({
        block: 'start', behavior: 'smooth'
      });
    });
  }
}

// ================
// прверка - есть ли локальное хранилище question
// при проверке считываем данные из хранилища в объект userInfo.
const testStorage = () => {
  try{
    userInfo.userName = localStorage.getItem('name');
    userInfo.userPhone = localStorage.getItem('phone');
    userInfo.userQuestion = localStorage.getItem('question');
    return true;
  } catch (err) {
    return false;
  }
};

// сохранение полей формы в локальное хранилище
// form - указатель на форму
// form['name'] доступ к элементу формы по имени (краткая запись)
// полная запись: form.element.ххх
// ххх - имя элемента (тег name)
// Когда мы уже получили форму, любой элемент доступен в именованной коллекции form.elements.
// можно искать по индексу form.elements[x]

// !!! у формы может быть имя!
// fieldset выступает как "подформа"
// есть обратная ссылка element.form - указывает на форму в которой работаем
// https://learn.javascript.ru/form-elements

const saveData = (form) => {
  localStorage.setItem('name', form['name'].value);
  localStorage.setItem('phone', form['phone'].value);
  localStorage.setItem('question', form['question'].value);
  // console.log('local-storage-saved');
}

//считываем хранилище и заполняем данные в форму
const loadData = (form) => {
  console.log(testStorage());
  if (testStorage()) {
    form['name'].value = userInfo.userName;
    form['phone'].value = userInfo.userPhone;
    form['question'].value = userInfo.userQuestion;
  }
}

// ===================
// функция заполнения по маске
// должна срабатыватьна каждый ввод знака
// сначала берем value и убираем "не цифры"
// затем оставшиеся цифры заносим в маску и результат выводим обратно в value
const phoneInputControl = (evt) => {
  let phoneNum = evt.target;
  let clearVal = phoneNum.dataset.phoneClear;
  const mask = phoneNum.dataset.phonePattern;
  const userPrefix = phoneNum.dataset.phonePrefix;
  const template = '+7(___)___-__-__';
  const defPrefix = '+7(';
  let resultValue = '';

  let index = 0;
  let prefix = userPrefix ? userPrefix : defPrefix;
  let pattern = mask ? mask : template;

  // смещение устанавливаем на цифровую длину префикса
  index = prefix.replace(/\D/g, '').length;

// если есть префикс и в поле ввода что-то меньше по размеру, чем префикс, то заполняем префиксом
    if (prefix.length >= phoneNum.value.length) {
      phoneNum.value = prefix;
    }

  // вычищаем номер от нецифровых символов
  let rawNum = phoneNum.value.replace(/\D/g, '');

  // в результат сначала заносим префикс
  resultValue += prefix;

  // начинаем перебор шаблона с позиции после префикса prefix.length
  // и с цифры номера после цифры префикса index
  // если в шаблоне встретили не символ замены '_' и есть дальше цифры - переносим символ из шаблона
  // иначе - переносим цифру

  for (let i = prefix.length; i < template.length; i++) {
      if (template[i] !== '_' && rawNum[index]) {
        resultValue += template[i];
      } else if (rawNum[index])  {
        resultValue += rawNum[index];
        index++;
      }
  }
  // записываем в поле вывода
  phoneNum.value = resultValue;
}

// ============
// установка addEventListener на поле ввода
for (let evt of ['input', 'blur', 'focus']) {
  feedbackForm.querySelector('[name="phone"]').addEventListener(evt, phoneInputControl);
};

// ==================
// переход по полям в popup
const popupFocusListArray = ['input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])'];

const switchField = (evt) => {
  const popUp = evt.target.closest('.popup');
  const popupFieldList = popUp.querySelectorAll(popupFocusListArray);
  const nodesList = Array.prototype.slice.call(popupFieldList);
  if (evt.key === 'Tab') {
    if (evt.shiftKey) {
      if (evt.target === nodesList[0]) {
        evt.preventDefault();
        nodesList[nodesList.length - 1].focus();
      }
    } else {
      if (evt.target === nodesList[nodesList.length - 1]) {
        evt.preventDefault();
        nodesList[0].focus();
      }
    }
  }
}

// ================
// отправка формы. любой формы
// проверки переновим сюда.

const onFormSubmit = (evt) => {

  const targetForm = evt.target.closest('form');
  const nameField = targetForm.querySelector('[name="name"]');
  const phoneField = targetForm.querySelector('[name="phone"]');

  targetForm.reportValidity();

  if (nameField.value.length === 0) {
    evt.preventDefault();
    nameField.setCustomValidity('Имя не заполнено');
  } else {
    nameField.setCustomValidity('');
  }
  if (phoneField.value.length === 0) {
    evt.preventDefault();
    phoneField.setCustomValidity('Телефон не заполнен.');
  } else if (!phonePattern.test(phoneField.value)) {
    evt.preventDefault();
    phoneField.setCustomValidity('Укажите телефонный номер в формате +7(XXX)XXX-XX-XX');
  }
  else {
    phoneField.setCustomValidity('');
  }

  if (phoneField.reportValidity() && nameField.reportValidity() ) {
    saveData(targetForm);
  }
  nameField.reportValidity();
  phoneField.reportValidity();
};

if (feedbackForm) {
  feedbackForm.querySelector('.feedback-form__button').addEventListener('click', onFormSubmit);
}

//===================
// листинеры для попапа

const removeListener = () => {
    removeEventListener('click', closePopup);
    removeEventListener('keydown', closePopupKey);
    removeEventListener('input', phoneInputControl);
    removeEventListener('blur', phoneInputControl);
    removeEventListener('focus', phoneInputControl);
    removeEventListener('click', onFormSubmit);
}

const closePopupKey = (evt) => {
  if (isEscape(evt)) {
    page.classList.remove('page--popup-open');
    removeListener();
  }
};

const closePopup = (evt) => {
  const target = evt.target;
  const popupCloseButton = document.querySelector('.popup__close-button');
  const popupForm = document.querySelector('.popup__content-wrapper');
  const isForm = target == popupForm || popupForm.contains(target);
  const isButton = target == popupCloseButton || popupCloseButton.contains(target);

  if (!isForm || isButton) {
    page.classList.remove('page--popup-open');
    removeListener();
  }
};

// const showPopup = ();
// =======================
// листенер для попапа
callRequest.addEventListener('click', (evt) => {
  page.classList.add('page--popup-open');

  // находим попап и форму
  const popUp = document.querySelector('.popup');
  const popupForm = document.forms.feedbackpopup;
  const popupPhone = popupForm.querySelector('[name="phone"]');
  const popupName = popupForm.querySelector('[name="name"]');

  // =================
  // загружаем форму
  // ставим фокус на форму
  // ставим листенер на submit (в нем же будет и проверка)

  loadData(popupForm);
  popupName.focus();
  popupForm.querySelector('.feedback-form__button').addEventListener('click', onFormSubmit);

  // ставим листенер на телефон
  for (let evt of ['input', 'blur', 'focus']) {
    popupPhone.addEventListener(evt, phoneInputControl);
  };

  // ставим листенеры на закрытие окна
  popUp.addEventListener('click', closePopup);
  popUp.addEventListener('keydown', switchField);
  document.addEventListener('keydown', closePopupKey);
});

page.classList.remove('no-js');
