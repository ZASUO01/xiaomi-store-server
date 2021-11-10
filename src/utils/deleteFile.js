const fs = require('fs');
const path = require('path');

const deletePdfFile = (filePath = path.resolve(__dirname, '..', 'pdf/output.pdf')) => {
    fs.unlink(filePath, function(err) {
        if (err) {
          throw err
        } 
      });
}

module.exports = {deletePdfFile}