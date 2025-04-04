export const colorPayment = (Payment: number) => {
    switch (Payment) {
        case 1: // DINHEIRO
            return "#3A7944"; // Verde
        case 2: // CARTÃO CRÉDITO
            return "#DB3236"; // Vermelho
        case 3: // CARTÃO DÉBITO
            return "#B01B02"; // Laranja
        case 4: // PIX
            return "#4CAF50"; // Verde claro
        case 5: // CHEQUE
            return "#0C082D"; // Roxo
        case 6: // DEPÓSITO
            return "#00003B"; // Azul
        case 7: // BOLETO
            return "#FF9800"; // Amarelo
        case 8: // BOLETO FÁCIL
            return "#F57C00"; // Laranja escuro
        case 9: // CARNÊ
            return "#795548"; // Marrom
        case 10: // DÉBITO EM CONTA
            return "#1E88E5"; // Azul claro
        case 11: // TRANSFERÊNCIA
            return "#047aba"; // Azul mais claro
        default:
            return "#646464"; // Cor padrão para tipos de pagamento não reconhecidos
    }
  };
  