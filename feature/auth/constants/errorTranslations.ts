export const errorTranslations: Record<string, string> = {
  form_param_nil: 'Pole musi być wypełnione.',
  form_password_pwned:
    'Twoje hasło znajduje się na liście haseł, które wyciekły na innych stronach w Internecie. Proszę użyć innego hasła.',
  invalid_email_address: 'Niepoprawny adres e-mail.',
  email_address_already_exists: 'Ten adres e-mail już istnieje.',
  invalid_password: 'Niepoprawne hasło.',
  password_too_short: 'Hasło jest zbyt krótkie.',
  password_too_weak: 'Hasło jest zbyt słabe.',
  missing_required_field: 'Brak wymaganego pola.',
  invalid_verification_code: 'Niepoprawny kod weryfikacyjny.',
} as const;
