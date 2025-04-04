const validateCPF = (cpf: string): boolean => {
  // Remove todos os caracteres não numéricos
  const cleanedCPF = cpf.replace(/\D/g, '');

  // Verifica se o CPF tem 11 dígitos
  if (cleanedCPF.length !== 11) {
    return false;
  }

  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1+$/.test(cleanedCPF)) {
    return false;
  }

  const calculateDigit = (cpf: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < cpf.length; i++) {
      total += parseInt(cpf.charAt(i)) * factor--;
    }
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  // Calcula o primeiro dígito verificador
  const firstDigit = calculateDigit(cleanedCPF.substring(0, 9), 10);
  if (firstDigit !== parseInt(cleanedCPF.charAt(9))) {
    return false;
  }

  // Calcula o segundo dígito verificador
  const secondDigit = calculateDigit(cleanedCPF.substring(0, 10), 11);
  if (secondDigit !== parseInt(cleanedCPF.charAt(10))) {
    return false;
  }

  return true;
};

export default validateCPF;
