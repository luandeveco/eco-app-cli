import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {formatAssociation} from '../../../utils/Formatting/FormatAssociation';
import {formatTime} from '../../../utils/Formatting/FormattingData';
import {Platform} from 'react-native';
import Share from 'react-native-share';

export default function detailedReport(
  pdf,
  Movement,
  dateFormatted,
  messengerData,
  institutionInforma,
  dateTime,
  nameReport?,
  dateTimeReport?,
  cnpj?
) {
  const sanitizedDateTimeReport = dateTimeReport.replace(
    /[^a-zA-Z0-9-_]/g,
    '_',
  );
  const sanitizedFileName = `${nameReport}_${sanitizedDateTimeReport}`;
  const formatValue = value => {
    return value % 1 === 0 ? `${value},00` : value.toString().replace('.', ',');
  };

  const createSectionText = (title, data, count) => {
    if (count == 0) return '';

    const total = data.reduce((sum, movement) => sum + movement.valor_prev, 0);

    return (
      `\n${title.toUpperCase()} (${count}) - R$ ${formatValue(total)}\n\n` +
      data
        .map(
          movement =>
            `${movement.numero_recibo} - ${formatTime(
              movement.data_baixa,
            )} - R$ ${formatValue(movement.valor_prev)}`,
        )
        .join('\n') +
      '\n'
    );
  };

  const moneyReceived = Movement.filter(
    movement =>
      (movement.status == 1 || movement.status == 2) &&
      movement.cod_tipo_pagamento === 1,
  );
  const moneyReturned = Movement.filter(
    movement => movement.status == 3 && movement.cod_tipo_pagamento == 1,
  );
  const creditcardReceived = Movement.filter(
    movement =>
      (movement.status == 1 || movement.status == 2) &&
      movement.cod_tipo_pagamento == 2,
  );
  const creditcardReturned = Movement.filter(
    movement => movement.status == 3 && movement.cod_tipo_pagamento == 2,
  );
  const debitCardReceived = Movement.filter(
    movement =>
      (movement.status == 1 || movement.status == 2) &&
      movement.cod_tipo_pagamento == 3,
  );
  const debitCardReturned = Movement.filter(
    movement => movement.status == 3 && movement.cod_tipo_pagamento == 3,
  );
  const pixReceived = Movement.filter(
    movement =>
      (movement.status == 1 || movement.status == 2) &&
      movement.cod_tipo_pagamento == 4,
  );
  const pixReturned = Movement.filter(
    movement => movement.status == 3 && movement.cod_tipo_pagamento == 4,
  );
  const checkReceived = Movement.filter(
    movement =>
      (movement.status == 1 || movement.status == 2) &&
      movement.cod_tipo_pagamento == 5,
  );
  const checkReturned = Movement.filter(
    movement => movement.status == 3 && movement.cod_tipo_pagamento == 5,
  );
  const depositReceived = Movement.filter(
    movement =>
      (movement.status == 1 || movement.status == 2) &&
      movement.cod_tipo_pagamento == 6,
  );
  const depositReturned = Movement.filter(
    movement => movement.status == 3 && movement.cod_tipo_pagamento == 6,
  );
  const ticketReceived = Movement.filter(
    movement =>
      (movement.status == 1 || movement.status == 2) &&
      movement.cod_tipo_pagamento == 7,
  );
  const ticketReturned = Movement.filter(
    movement => movement.status == 3 && movement.cod_tipo_pagamento == 7,
  );
  const easyBillReceived = Movement.filter(
    movement =>
      (movement.status == 1 || movement.status == 2) &&
      movement.cod_tipo_pagamento == 8,
  );
  const easyBillReturned = Movement.filter(
    movement => movement.status == 3 && movement.cod_tipo_pagamento == 8,
  );
  const bookletReceived = Movement.filter(
    movement =>
      (movement.status == 1 || movement.status == 2) &&
      movement.cod_tipo_pagamento == 9,
  );
  const bookletReturned = Movement.filter(
    movement => movement.status == 3 && movement.cod_tipo_pagamento == 9,
  );
  const debitAccountReceived = Movement.filter(
    movement =>
      (movement.status == 1 || movement.status == 2) &&
      movement.cod_tipo_pagamento == 10,
  );
  const debitAccountReturned = Movement.filter(
    movement => movement.status == 3 && movement.cod_tipo_pagamento == 10,
  );
  const transferReceived = Movement.filter(
    movement =>
      (movement.status == 1 || movement.status == 2) &&
      movement.cod_tipo_pagamento == 11,
  );
  const transferReturned = Movement.filter(
    movement => movement.status === 3 && movement.cod_tipo_pagamento === 11,
  );

  const relatorioDev =
    createSectionText('Dinheiro', moneyReturned, moneyReturned.length) +
    createSectionText(
      'Cartao de Credito',
      creditcardReturned,
      creditcardReturned.length,
    ) +
    createSectionText(
      'Cartao de Debito',
      debitCardReturned,
      debitCardReturned.length,
    ) +
    createSectionText('PIX', pixReturned, pixReturned.length) +
    createSectionText('Cheque', checkReturned, checkReturned.length) +
    createSectionText('Deposito', depositReturned, depositReturned.length) +
    createSectionText('Boleto', ticketReturned, ticketReturned.length) +
    createSectionText(
      'Boleto Facil',
      easyBillReturned,
      easyBillReturned.length,
    ) +
    createSectionText('Carne', bookletReturned, bookletReturned.length) +
    createSectionText(
      'Debito em Conta',
      debitAccountReturned,
      debitAccountReturned.length,
    ) +
    createSectionText(
      'Transferencia',
      transferReturned,
      transferReturned.length,
    );

  const relatorioRec =
    createSectionText('Dinheiro', moneyReceived, moneyReceived.length) +
    createSectionText(
      'Cartao de Credito',
      creditcardReceived,
      creditcardReceived.length,
    ) +
    createSectionText(
      'Cartao de Debito',
      debitCardReceived,
      debitCardReceived.length,
    ) +
    createSectionText('PIX', pixReceived, pixReceived.length) +
    createSectionText('Cheque', checkReceived, checkReceived.length) +
    createSectionText('Deposito', depositReceived, depositReceived.length) +
    createSectionText('Boleto', ticketReceived, ticketReceived.length) +
    createSectionText(
      'Boleto Facil',
      easyBillReceived,
      easyBillReceived.length,
    ) +
    createSectionText('Carne', bookletReceived, bookletReceived.length) +
    createSectionText(
      'Debito em Conta',
      debitAccountReceived,
      debitAccountReceived.length,
    ) +
    createSectionText(
      'Transferencia',
      transferReceived,
      transferReceived.length,
    );

  if (pdf) {
    const templatePDF = () => {
      const createTable = (title, returnedData, total) => {
        const createRow = returnedData => {
          return returnedData
            .map(
              movement => `
              <tr>
                <td style="padding: 5px; border: 1px solid #000; text-align: center;">${
                  movement.numero_recibo
                }</td>
                <td style="padding: 5px; border: 1px solid #000; text-align: center;">${formatTime(
                  movement.data_baixa,
                )}</td>
                <td style="padding: 5px; border: 1px solid #000; text-align: center;">${formatValue(
                  movement.valor_prev,
                )}</td>
              </tr>
            `,
            )
            .join('');
        };

        return `
            <h6 style="font-size: 14px;">${title.toUpperCase()} (${
          returnedData.length
        }) - Total: R$ ${formatValue(total)}</h6>
            <table style="width: 100%; border: 1px solid #000; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="padding: 5px; border: 1px solid #000; text-align: center;">Número Recibo</th>
                  <th style="padding: 5px; border: 1px solid #000; text-align: center;">Hora da Baixa</th>
                  <th style="padding: 5px; border: 1px solid #000; text-align: center;">Valor</th>
                </tr>
              </thead>
              <tbody>
                ${createRow(returnedData)}
              </tbody>
            </table>
          `;
      };

      const createTwoColumnLayout = (returnedData, receivedData, title) => {
        const totalReturned = returnedData.reduce(
          (sum, movement) => sum + movement.valor_prev,
          0,
        );
        const totalReceived = receivedData.reduce(
          (sum, movement) => sum + movement.valor_prev,
          0,
        );

        return `
            <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
              <div style="width: 48%; padding-right: 2%;">
                ${
                  receivedData.length > 0
                    ? createTable(`${title} Rec`, receivedData, totalReceived)
                    : ''
                }
              </div>
              <div style="width: 48%; padding-left: 2%;">
                ${
                  returnedData.length > 0
                    ? createTable(`${title} Dev`, returnedData, totalReturned)
                    : ''
                }
              </div>
            </div>
          `;
      };

      return `
          <html>
            <head>
              <style>
                @page {
                  margin: 20px;
                }
                body {
                  margin: 20px;
                  padding: 20px;
                  font-family: Arial, sans-serif;
                  box-sizing: border-box;
                }
                .header {
                  width: 100%;
                  margin-bottom: 20px;
                  padding: 10px;
                  font-size: 12px;
                  border: 2px solid #000;
                  border-radius: 5px;
                  box-sizing: border-box;
                }
                .header .top {
                  display: flex;
                  justify-content: space-between;
                  font-weight: bold;
                }
                .details span {
                  display: block;
                  margin-top: 5px;
                }
                .separator {
                  border-top: 2px solid #000;
                  margin-top: 10px;
                  margin-bottom: 20px;
                }
                .Title {
                  text-align: center;
                  justify-content: center;
                  align-items: center;
                  margin-top: 40px;
                }
                .content {
                  font-size: 14px;
                }
                .footer {
                  position: absolute;
                  bottom: 20px;
                  left: 20px;
                  font-size: 12px;
                  width: 100%;
                  text-align: center;
                }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="top">
                  <span><b>CNPJ:</b> ${cnpj}</span>
                </div>
                <div class="details">
                  <span><b>Mensageiro:</b> ${messengerData.nome}</span>
                  <span><b>Data do movimento:</b> ${dateFormatted}</span>
                  <span><b>Data/Hora da impressão:</b> ${dateTimeReport}</span>
                </div>
              </div>
              <div class="content">
                <h1 class="Title">${nameReport}</h1>
                
                ${createTwoColumnLayout(
                  moneyReturned,
                  moneyReceived,
                  'Dinheiro',
                )}
                ${createTwoColumnLayout(
                  creditcardReturned,
                  creditcardReceived,
                  'Cartão de Crédito',
                )}
                ${createTwoColumnLayout(
                  debitCardReturned,
                  debitCardReceived,
                  'Cartão de Débito',
                )}
                ${createTwoColumnLayout(pixReturned, pixReceived, 'PIX')}
                ${createTwoColumnLayout(checkReturned, checkReceived, 'Cheque')}
                ${createTwoColumnLayout(
                  depositReturned,
                  depositReceived,
                  'Depósito',
                )}
                ${createTwoColumnLayout(
                  ticketReturned,
                  ticketReceived,
                  'Boleto',
                )}
                ${createTwoColumnLayout(
                  easyBillReturned,
                  easyBillReceived,
                  'Boleto Fácil',
                )}
                ${createTwoColumnLayout(
                  bookletReturned,
                  bookletReceived,
                  'Carnê',
                )}
                ${createTwoColumnLayout(
                  debitAccountReturned,
                  debitAccountReceived,
                  'Débito em Conta',
                )}
                ${createTwoColumnLayout(
                  transferReturned,
                  transferReceived,
                  'Transferência',
                )}
              </div>
            </body>
          </html>
        `;
    };

    const createPDF = async () => {
      const htmlContent = templatePDF();

      try {
        let PDFOptions = {
          html: htmlContent,
          fileName: sanitizedFileName,
          directory: Platform.OS === 'android' ? 'Documents' : 'Documents',
          width: 595.28,
          height: 841.89,
          padding: 20,
          addPageNumbers: true,
        };
    
        let file = await RNHTMLtoPDF.convert(PDFOptions);
    
        if (!file.filePath) {
          throw new Error('PDF file path is undefined.');
        }   
        const shareOptions = {
          title: 'Compartilhar Relatório PDF',
          url: `file://${file.filePath}`,
          type: 'application/pdf',
          message: 'Confira o relatório gerado.',
        };
    
        await Share.open(shareOptions);
      } catch (error) {
        console.error('Falha ao gerar ou compartilhar o PDF:', error.message);
      }
    };    

    createPDF();
  } else {
    const Text =
    '================================\n' +
    '         Mensageiro(a)\n' +
    '================================\n' +
    formatAssociation(institutionInforma.cabecalho_android) +
    '\nMENSAGEIRO: ' +
    messengerData.nome +
    '\nData do movimento: ' +
    dateFormatted +
    '\nData/Hora da impressao: ' +
    '\n' +
    dateTime +
    '\n\nRELATORIO SEM FINALIZACAO' +
    '\n\n------RELATORIO DEVOLVIDO-------' +
    relatorioDev +
    '\n\n-------RELATORIO RECEBIDO-------' +
    relatorioRec +
    '\n--------------------------------\n';

  return Text;
  }
}
