import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { Platform } from 'react-native';
import Share from 'react-native-share';

export default function summarizedReport(
  pdf?,
  time?,
  dateFormatted?,
  messengerData?,
  nameReport?,
  dateTimeReport?,
  cnpj?,
  reportPending?,
  reportReturned?,
  reportReceived?,
  TotalReceived?,
  TotalWorked?
) {
  const sanitizedDateTimeReport = dateTimeReport.replace(/[^a-zA-Z0-9-_]/g, '_');
  const sanitizedFileName = `${nameReport}_${sanitizedDateTimeReport}`;

  if (pdf) {
    const templatePDF = () => {
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
                  font-size: 24px;
                  font-weight: bold;
                }
                .content {
                  font-size: 14px;
                }
                .section {
                  margin-bottom: 20px;
                }
                .section h2 {
                  font-size: 18px;
                  border-bottom: 1px solid #000;
                  padding-bottom: 5px;
                  margin-bottom: 10px;
                }
                .section p {
                  margin: 5px 0;
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
                  <span><b>Mensageiro:</b> ${messengerData}</span>
                  <span><b>Data do movimento:</b> ${dateFormatted}</span>
                  <span><b>Data/Hora da impressão:</b> ${dateTimeReport}</span>
                </div>
              </div>
              <div class="content">
                <h1 class="Title">${nameReport}</h1>

                <div class="section">
                  <h2>Relatório Pendente</h2>
                  <p style="white-space: nowrap;">${reportPending ? reportPending.replace(/\n/g, '<br/>') : 'Nenhum dado disponível'}</p>
                </div>

                <div class="section">
                  <h2>Relatório Devolvido</h2>
                  <p style="white-space: nowrap;">${reportReturned ? reportReturned.replace(/\n/g, '<br/>') : 'Nenhum dado disponível'}</p>
                </div>

                <div class="section">
                  <h2>Relatório Recebido</h2>
                  <p style="white-space: nowrap;">${reportReceived ? reportReceived.replace(/\n/g, '<br/>') : 'Nenhum dado disponível'}</p>
                </div>

                <div class="section">
                  <h2>Total Recebido</h2>
                  <p style="white-space: nowrap;">${TotalReceived ? TotalReceived.replace(/\n/g, '<br/>') : 'Nenhum dado disponível'}</p>
                </div>

                <div class="section">
                  <h2>Total Trabalhado</h2>
                  <p style="white-space: nowrap;">${TotalWorked ? TotalWorked.replace(/\n/g, '<br/>') : 'Nenhum dado disponível'}</p>
                </div>
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
      const templatePDF = () => {
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
                    font-size: 24px;
                    font-weight: bold;
                  }
                  .content {
                    font-size: 14px;
                  }
                  .section {
                    margin-bottom: 20px;
                  }
                  .section h2 {
                    font-size: 18px;
                    border-bottom: 1px solid #000;
                    padding-bottom: 5px;
                    margin-bottom: 10px;
                  }
                  .section p {
                    margin: 5px 0;
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
                    <span><b>Mensageiro:</b> ${messengerData}</span>
                    <span><b>Data do movimento:</b> ${dateFormatted}</span>
                    <span><b>Data/Hora da impressão:</b> ${dateTimeReport}</span>
                  </div>
                </div>
                <div class="content">
                  <h1 class="Title">${nameReport}</h1>
  
                  <div class="section">
                    <h2>Relatório Pendente</h2>
                    <p style="white-space: nowrap;">${reportPending ? reportPending.replace(/\n/g, '<br/>') : 'Nenhum dado disponível'}</p>
                  </div>

                  <div class="section">
                    <h2>Relatório Devolvido</h2>
                    <p style="white-space: nowrap;">${reportReturned ? reportReturned.replace(/\n/g, '<br/>') : 'Nenhum dado disponível'}</p>
                  </div>
  
                  <div class="section">
                    <h2>Relatório Recebido</h2>
                    <p style="white-space: nowrap;">${reportReceived ? reportReceived.replace(/\n/g, '<br/>') : 'Nenhum dado disponível'}</p>
                  </div>
                  <h1 class="Title">ESSE RELATÓRIO, CONTEM SOMENTE OS RECIBOS RECEBIDOS E DEVOLVIDOS PELO MENSAGEIRO. ESSES RECIBOS JÁ ESTÃO NO SISTEMA.</h1>
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
  }
}
