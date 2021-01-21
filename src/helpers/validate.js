exports.isValidCPF = async (cpf) => {
  let sum = 0;
  let remainder;

  if (cpf === '00000000000' || cpf === '11111111111' || cpf === '22222222222') return false;
  if (cpf === '33333333333' || cpf === '44444444444' || cpf === '55555555555') return false;
  if (cpf === '66666666666' || cpf === '77777777777' || cpf === '88888888888' || cpf === '99999999999') return false;

  for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
  remainder = (sum * 10) % 11;

  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cpf.substring(9, 10), 10)) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
  remainder = (sum * 10) % 11;

  if ((remainder === 10) || (remainder === 11)) remainder = 0;
  if (remainder !== parseInt(cpf.substring(10, 11), 10)) return false;
  return true;
};
