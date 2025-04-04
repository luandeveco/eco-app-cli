export const paymentReceipt = (payment: number) => {
    switch (payment) {
      case 1:
        return "DINHEIRO";
      case 2:
        return "CARTÃO CRÉDITO";
      case 3:
        return "CARTÃO DÉBITO";
      case 4:
        return "PIX";
      case 5:
        return "CHEQUE";
      case 6:
        return "DEPOSITO";
      case 7:
        return "BOLETO";
      case 8:
        return "BOLETO FÁCIL";
      case 9:
        return "CARNÊ";
      case 10:
        return "DÉBITO EM CONTA";
      case 11:
        return "TRANSFERÊNCIA";
      default:
        return "FORMA DE PAGAMENTO NÃO RECONHECIDA";
    }
  };
  