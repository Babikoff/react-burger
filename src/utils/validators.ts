const PWD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{6,}$/;
const PWD_REGEX_WITH_EMPTY_VALUES =
  /^(?:$|[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{6,})$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const NAME_REGEX = /^[A-Za-zА-Яа-яЁё0-9\s-]{2,}$/;

type TValidator = {
  validator: (value: string) => boolean;
  message: string;
};

type TValidators = {
  name: TValidator;
  email: TValidator;
  password: TValidator;
};

export const getValidators = (allowEmptyPassword: boolean): TValidators => ({
  name: {
    validator: (value: string) => !!value && NAME_REGEX.test(value.trim()),
    message: 'Укажите корретное имя.',
  },
  email: {
    validator: (value: string) => EMAIL_REGEX.test(value.trim()),
    message: 'Укажите корректный email.',
  },
  password: {
    validator: (value: string) =>
      (allowEmptyPassword ? PWD_REGEX_WITH_EMPTY_VALUES : PWD_REGEX).test(value.trim()),
    message: 'Укажите пароль посложнее.',
  },
});
