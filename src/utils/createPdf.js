const pdfDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');


const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const storeCnpj = '123456789'
const storeContact = 'xiaomistore@gmail.com'
let y = 0;
let pages = 1;

const getTotalValue = (products) => {
    let totalValue = 0;
    for(let i = 0; i < products.length; i++){
        totalValue += Number(products[i].value)    
    }
    return totalValue.toFixed(2);
}

const setPagesCounter = (doc, id) => {
    if(pages > 1){
        const range = doc.bufferedPageRange();
        let i = range.start;
        const end = range.start + range.count;
        for (i; i < end; i++) {
            doc.switchToPage(i);
            doc
            .font('Helvetica')
            .fontSize(8)
            .text(`Recibo ${id} - Página ${i + 1}`, 30, 760);
        }
    }
        
}


const setLogo = (doc) => {
    y+=15;
    const imageWidth = 100;
    const pageWidth = doc.page.width;
    const startx = (pageWidth / 2) - (imageWidth / 2);
    doc.image(path.resolve(__dirname,'..', 'assets/logo.png'), startx, y, {
        width: imageWidth,
        align: 'center',
    });
    y+=125;
    //140
}

const generateHeaderInfo = (doc, data) => {
    doc
    .font('Helvetica-Bold').fontSize(10)
    .text('XIAOMI STORE BH', 30, y)
    .text('PAGADOR:', 400, y)
    .font('Helvetica').fontSize(9)
    .text(`CNPJ: ${storeCnpj}`, 30, y+15)
    .text(`NOME: ${data.customer}`, 400, y+15)
    .text(`CONTATO: ${storeContact}`, 30, y+30)
    .text(`Contato: ${data.customer_email}`,400, y+30)
    .text(`Documento: ${data.cpf}`, 400,  y+45)
    y+=45;
    //170
}

const generateReceiptId = (doc, id) => {
    y+=30;
    const pageWidth = doc.page.width;
    doc.font('Helvetica-Bold')
    .fontSize(21);
    const w1 = doc.widthOfString(`RECIBO Nº ${id}`);
    doc.image(path.resolve(__dirname, '..' ,'assets/gradient.png'), 0, y, {
        width: pageWidth
    })
    .text(`RECIBO Nº ${id}`, (pageWidth/2) - (w1/2), y + 10)
    .fontSize(16);
    const w2 = doc.widthOfString("REFERENTE A:"); 
    doc.text('REFERENTE A:', (pageWidth/2) -(w2/2), y + 45);
    y+=45;
    //245
}

const generateProductsHead = (doc) => {
    y+=45;
    doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('Produto:', 30, y)
    .text('IMEI/SN:', 320, y)
    .text('Valor:', 480, y)
    //290
}

const generateProductLines = (doc, products) => {
    y+=40;
    doc.lineWidth(2);
    let i = 0;
    let j = 0;
    for(i; i < products.length; i++){
        if(y + (40 * i) - (40 * j)  >= 720){
            doc.addPage({size: 'A4'})
            .lineWidth(2);
            y = 100;
            j = i;
            pages++;
        }
        doc
        .font('Helvetica')
        .moveTo(30, y + (40 * i) - (40 * j))                               
        .lineTo(300, y + (40 * i) - (40*j))                           
        .lineTo(300, y + (40 * i) - (40 * j) - 20)                             
        .stroke()
        .text(`${products[i].product} - ${products[i].color} - ${products[i].memory} `, 35, y + (40 * i) - (40* j) - 15)
        .moveTo(320, y + (40 * i) - (40 * j))
        .lineTo(460, y + (40 * i) - (40 * j))
        .lineTo(460, y + (40 * i) - (40 * j) - 20)
        .stroke()
        .text(products[i].imei, 325, y + (40 * i) - (40 * j) - 15)
        .moveTo(480, y + (40 * i) - (40 * j))
        .lineTo(580, y + (40 * i) - (40 * j))
        .lineTo(580, y + (40 * i) - (40 * j) - 20)
        .stroke()
        .text(`R$ ${Number(products[i].value).toFixed(2)}`, 485, y + (40 * i) - (40 * j) - 15, {lineBreak: false});
    }
    y += (40* i) - (40 * j);
}

const generateProductsFoot = (doc, value) => {
    y += 30;
    if(y + 10 >= 720){
        doc.addPage({size: 'A4'});
        y = 100;
        pages++;
    }
    doc
    .font('Helvetica-Bold')
    .text("RECEBEMOS O VALOR:", 350, y - 5)
    .fillColor('#ff5a00')
    .text("Total:", 480, y - 30)
    .text(`R$ ${value}`, 485, y - 5, {lineBreak: false});
    doc.moveTo(480, y + 10)
    .lineTo(580, y + 10)
    .lineTo(580, y - 10)
    .stroke("#ff5a00");
}


const generatePayments = (doc, payments) => {
    y += 40;
    doc.fontSize(12)
    .font('Helvetica-Bold')
    .fontSize(12)
    .fillColor('black')
    .text("FORMA DE PAGAMENTO:" ,30, y);
    doc.font('Helvetica')
    .fontSize(11)
    let i = 0;
    let j = 0;
    for(i; i < payments.length; i++){
        if(y + (20 * i) - (20 * j)  >= 720){
            doc.addPage({size: 'A4'})
            .lineWidth(2)
            .font('Helvetica')
            y = 100;
            j = i;
            pages++;
        }
        doc.text(`${payments[i].type} - ${payments[i].parts} - R$ ${Number(payments[i].value).toFixed(2)}`, 200, y + (20 * i) - (20 * j));
    }
    y += (20 * i) - (20 * j);
}

const generateFooterInfo = (doc, date, sender) => {
    y += 60;
    if(y + 70 >= 720){
        doc.addPage({size: 'A4'});
        y = 100;
        pages++;
    }
    doc.fontSize(11);
    const w1 = doc.widthOfString(`Belo Horizonte, ${date}`);
    const wPage = doc.page.width;
    doc
    .text(`Belo Horizonte, ${date}`, (wPage/2) - (w1/2), y)
    .text("Garantia de  90 dias.", 30, y + 30)
    .text('ASSINATURA: Xiaomi Store Bh', 30, y + 50)
    .text(`Emitente: ${sender}`, 30, y + 70)
    .text('Obs: Nossa garantia não cobre mal uso do aparelho como: riscos, quebras, avaria física ou problema no software (Android) como engasgamento ou lentidão.', 30, y+100)
}

const generatePdf = (data, id) => {
    const doc = new pdfDocument({size: 'A4', margin:40, bufferPages: true});
    doc.pipe(fs.createWriteStream(path.resolve(__dirname, '..', 'pdf/output.pdf')));

    const totalValue = getTotalValue(data.products);
    const d = new Date();
    const actDate = `${d.getDate()} de ${months[d.getMonth()]} de ${d.getFullYear()}`
    setLogo(doc);
    generateHeaderInfo(doc, data);
    generateReceiptId(doc, id);
    generateProductsHead(doc);
    generateProductLines(doc, data.products);
    generateProductsFoot(doc, totalValue);
    generatePayments(doc, data.payments);
    generateFooterInfo(doc, actDate, data.sender);
    setPagesCounter(doc, id);

    y = 0;
doc.end();
}

module.exports = {generatePdf};

