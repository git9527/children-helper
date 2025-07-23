import {generatePdf} from "../util/pdf";
const fs = require('fs');
const path = require('path');

test('PDF generation', async () => {
    const details = {
        name: '张小三',
        id: '123456789012345678',
        phone: '13800138000',
        receiverContact: '李四',
        receiverPhone: '13900139000',
        receiverName: '花木街道',
        receiverLocation: '上海市浦东新区花木街道',
        month: '7'
    };
    const pdfBytes = await generatePdf(details);

    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    //write bytes into local file for debugging
    const outputPath = path.join(__dirname, 'test-output.pdf');
    fs.writeFileSync(outputPath, pdfBytes);
    expect(pdfBytes.length).toBeGreaterThan(0);
})