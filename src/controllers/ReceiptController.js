const  {sendEmail} = require('../utils/sendEmail');
const {generatePdf} = require('../utils/createPdf');
const {deletePdfFile} = require('../utils/deleteFile');
const AppData = require('../models/AppData');

exports.receiptHandler = async (req, res) => {
    const {receipt} = req.body;
    if(!receipt){
        res.status(400).json({error:'Missing request data.'});
        return;
    }
    
    try{
        const dataSet = await AppData.find();
        const data = dataSet[0];
        const num = data.autonumber;
        data.autonumber += 1;
        await data.save();
        generatePdf(receipt, num);
        await sendEmail(receipt.customer_email, receipt.customer);
    }catch(err){
        res.status(500).json({error: err.message});
        return;
    }
    
    deletePdfFile();

    res.status(200).json({
        message: 'Email sent with success',
        receipt
    });
}