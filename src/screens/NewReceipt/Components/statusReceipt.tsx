export const statusReceipt = (status: number) => {
  switch (status) {
    case 1:
      return "RECEBIDO";
    case 2: // RECEBIDO BAIXA FUTURA
      return "RECEBIDO";
    case 0:
      return "PENDENTE";
    case 3: // DEVOLVIDO CONTRIBUIÇÃO
      return "DEVOLVIDO";
    case 4:
      return "DEVOLVIDO";
    default:
      break;
  }
}