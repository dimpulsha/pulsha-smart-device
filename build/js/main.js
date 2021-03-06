'use strict';
const page = document.querySelector('.page');
const accordeonList = document.querySelectorAll('.accordeon');
const accordeonControlList = document.querySelectorAll('.accordeon__control');
const smoothLink = document.querySelector('.hello__link');
const callRequest = document.querySelector('.header__button--call-request');
const nameInput = document.querySelector('#name-id');
const phoneInput = document.querySelector('#phone-id');
const phonePattern = /\+7\(\d{3}\)\d{3}-\d{2}-\d{2}/;
const submitPageForm = document.querySelector('.feedback-form__button--submit');

const isEscape = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const switchAccordeon = (evt) => {
  const target = evt.target;
  const accordeonTarget = target.closest('.accordeon');
  const accordeonTargetId = accordeonTarget.dataset.accordeonid;
  const targetId = `accordeon--${accordeonTargetId}`;

  for (let i = 0; i < accordeonList.length; i++) {
    if ((accordeonList[i].classList.contains('accordeon--open')) && (!accordeonList[i].classList.contains(targetId))) {
      accordeonList[i].classList.remove('accordeon--open');
    } else if (accordeonList[i].classList.contains(targetId)) {
      accordeonList[i].classList.toggle('accordeon--open');
    }
  }
}

if (accordeonControlList) {
  accordeonControlList.forEach((listItem) => {
    listItem.addEventListener('click', switchAccordeon)
  })
}

if (smoothLink) {
  for (let i = 0; i < smoothLink.length; i++) {
    let menuItem = smoothLink[i];
    let sectionId = smoothLink.getAttribute('href').substring(1);
    menuItem.addEventListener('click', function (evt) {
      evt.preventDefault();
      // pageHeader.classList.remove('page--menu-open');
      document.getElementById(sectionId).scrollIntoView({
        block: 'start', behavior: 'smooth'
      });
    });
  }
}

const userInfo = {
  userName: '',
  userPhone: ''
};

const testStorage = () => {
  try{
    userInfo.userName = localStorage.getItem('name');
    userInfo.userPhone = localStorage.getItem('phone');
    return true;
  } catch (err) {
    return false;
  }
};

const saveData = (form) => {
  localStorage.setItem('name', form['name'].value);
  localStorage.setItem('phone', form['phone'].value);
}

const loadData = (form) => {
  if (testStorage()) {
    form['name'].value = userInfo.userName;
    form['phone'].value = userInfo.userPhone;
  }
}

const phoneInputControl = (evt) => {
  let phoneNum = evt.target;
  let clearVal = phoneNum.dataset.phoneClear;
  let mask = phoneNum.dataset.phonePattern;
  const template = '+7(___)___-__-__';
  const prefix = '+7(';
  let pattern = mask ? mask : template;
  let resultValue = '';
  let symbolNum = 1;


  if (prefix) {
    if (prefix.length > phoneNum.value.length) {
      phoneNum.value = prefix;

    }
  }
// slice(prefix.length).
  let rawNum = phoneNum.value.replace(/\D/g, '');
  resultValue += prefix;

  for (let i = prefix.length; i < template.length; i++) {

      if (template[i] !== '_' && rawNum[symbolNum]) {
        resultValue += template[i];

      } else if (rawNum[symbolNum])  {
        resultValue += rawNum[symbolNum];
        symbolNum++;
      }
  }
  phoneNum.value = resultValue;
}

const checkEmptyName = (evt, nameField) => {
  if (nameField.value.length === 0) {
    evt.preventDefault();
    nameField.setCustomValidity('?????? ???? ??????????????????');
  } else {
    nameField.setCustomValidity('');
  }
  nameField.reportValidity();
}

const checkPhoneInput = (evt, phoneField) => {
  if (phoneField.value.length === 0) {
    evt.preventDefault();
    phoneField.setCustomValidity('?????????????? ???? ????????????????.');

  } else if(!phonePattern.test(phoneField.value)){
    evt.preventDefault();
    phoneField.setCustomValidity('?????????????? ???????????????????? ?????????? ?? ?????????????? +7(XXX)XXX-XX-XX.');
  }
  else {
    phoneField.setCustomValidity('');
  }
  phoneField.reportValidity();
};

const checkFormSubmit = (evt) => {
  checkEmptyName(evt, nameInput);
  checkPhoneInput(evt, phoneInput);
}

for (let evt of ['input', 'blur', 'focus']) {
  phoneInput.addEventListener(evt, phoneInputControl);
};

submitPageForm.addEventListener('click', checkFormSubmit);

const popupFocusListArray = ['input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  'button:not([disabled]):not([aria-hidden])',
  'textarea:not([disabled]):not([aria-hidden])'];

const closePopupKey = (evt) => {
  if (isEscape(evt)) {
    page.classList.remove('page--popup-open');
    removeEventListener('click', closePopup);
    removeEventListener('keydown', closePopupKey);
    removeEventListener('input', phoneInputControl);
    removeEventListener('blur', phoneInputControl);
    removeEventListener('focus', phoneInputControl);
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
    removeEventListener('click', closePopup);
    removeEventListener('keydown', closePopupKey);
    removeEventListener('input', phoneInputControl);
    removeEventListener('blur', phoneInputControl);
    removeEventListener('focus', phoneInputControl);
  }
};

const switchField = (evt) => {
  const popUp = evt.target.closest('.popup');
  const popupFieldList = popUp.querySelectorAll(popupFocusListArray);
  // console.log('popupFieldList');
  // console.log(popupFieldList);
  const nodesList = Array.prototype.slice.call(popupFieldList);
  // console.log('nodesList');
  // console.log(nodesList);
  // const fieldIndex =

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
callRequest.addEventListener('click', (evt) => {
  page.classList.add('page--popup-open');
  const popUp = document.querySelector('.popup');
  const popupForm = popUp.querySelector('.feedback-form');
  const popupPhone = popUp.querySelector('#phone-popup-id');
  const popupName = popUp.querySelector('#name-popup-id');
  const popupSubmit = popUp.querySelector('.feedback-form__button--submit');



  loadData(popupForm);
  popupName.focus();



  const checkPopupSubmit = (evt) => {
    checkEmptyName(evt, popupName);
    checkPhoneInput(evt, popupPhone);
    saveData(popupForm);
  }

  for (let evt of ['input', 'blur', 'focus']) {
    popupPhone.addEventListener(evt, phoneInputControl);
  };

  popUp.addEventListener('click', closePopup);
  popUp.addEventListener('keydown', switchField);
  document.addEventListener('keydown', closePopupKey);
  popupSubmit.addEventListener('click', checkPopupSubmit)
});

page.classList.remove('no-js');
