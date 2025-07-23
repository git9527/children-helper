const fontkit = require('@pdf-lib/fontkit');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

function addLine(page, text, font, fontSize, x, y) {
    page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
    });
}

function addCenteredText(page, text, font, fontSize, y) {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const { width } = page.getSize();
    const x = (width - textWidth) / 2;
    addLine(page, text, font, fontSize, x, y);
}

function addRightAlignedText(page, text, font, fontSize, y) {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const { width } = page.getSize();
    const x = width - textWidth - 50; // 50px margin from the right
    addLine(page, text, font, fontSize, x, y);
}

function addTextWithUnderline(page, text, font, fontSize, x, y) {
    addLine(page, text, font, fontSize, x, y);
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    page.drawLine({
        start: { x: x - 2, y: y - 3 }, // 3px below the text
        end: { x: x + textWidth + 2, y: y - 3 },
        thickness: 1,
        color: rgb(0, 0, 0),
    });
}

function addTextWithFixedWidthAndUnderline(page, text, font, fontSize, x, y, width) {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const padding = (width- textWidth) /2;
    addLine(page, text, font, fontSize, x + padding, y);
    page.drawLine({
        start: { x, y: y - 3 }, // 3px below the text
        end: { x: x + width, y: y - 3 },
        thickness: 1,
        color: rgb(0, 0, 0),
    });
}

function getWidth(font, fontSize, count) {
    return font.widthOfTextAtSize('缩'.repeat(count), fontSize);
}

async function generatePdf(details) {
    const pdfDoc = await PDFDocument.create();
    // 注册 fontkit
    pdfDoc.registerFontkit(fontkit);
    const baseFontSize = 16; // 基础字体大小
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 尺寸

    const fontBytes = fs.readFileSync('./src/assets/fonts/SimSun.ttf');
    const customFont = await pdfDoc.embedFont(fontBytes, { subset: true });

    addCenteredText(page, '张江科学城综合党委', customFont, baseFontSize + 2, 780);
    addRightAlignedText(page, '党员组织关系介绍信（系统内）     通知联', customFont, baseFontSize, 730)
    addRightAlignedText(page, '沪张综委第    号', customFont, baseFontSize, 710);
    addTextWithUnderline(page, '张江科学城综合党委：', customFont, baseFontSize, 60, 680);

    addLine(page,'现介绍', customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 2), 650);
    addTextWithFixedWidthAndUnderline(page, details.name, customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 5), 650, getWidth(customFont, baseFontSize, 4));
    addLine(page, '同志（男/女）系中共（预备/正式）党员，身份', customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 9), 650);
    addLine(page, '证号', customFont, baseFontSize, 60, 620);
    addTextWithFixedWidthAndUnderline(page, details.id, customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 2), 620, getWidth(customFont, baseFontSize, 14));
    addLine(page, '，由', customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 16), 620);
    addTextWithFixedWidthAndUnderline(page, '花旗党总支', customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 18), 620, getWidth(customFont, baseFontSize, 12));
    addLine(page, '去', customFont, baseFontSize, 60, 590);
    addTextWithFixedWidthAndUnderline(page, '你', customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 1), 590, getWidth(customFont, baseFontSize, 3));
    addLine(page, '处，请转接组织关系。党费交至', customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 4), 590);
    addTextWithFixedWidthAndUnderline(page, details.month, customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 18), 590, getWidth(customFont, baseFontSize, 2));
    addLine(page, '月份。', customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 20), 590);
    addLine(page, '党员电话与紧急联系人电话：', customFont, baseFontSize, 60, 560);
    addTextWithFixedWidthAndUnderline(page, details.phone, customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 13), 560, getWidth(customFont, baseFontSize, 10));
    addLine(page, '对方党组织联系人和联系电话：', customFont, baseFontSize, 60, 530);
    addTextWithFixedWidthAndUnderline(page, details.receiverContact + "/" + details.receiverPhone, customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 14), 530, getWidth(customFont, baseFontSize, 13));
    addLine(page, '抬头：', customFont, baseFontSize, 60, 500);
    addTextWithUnderline(page, details.receiverName, customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 3), 500);
    addLine(page, '去处：', customFont, baseFontSize, 60, 470);
    addTextWithUnderline(page, details.receiverLocation, customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 3), 470);

    const currentYear = new Date().getFullYear() + "";
    addTextWithFixedWidthAndUnderline(page, currentYear, customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 22), 400, getWidth(customFont, baseFontSize, 3));
    addLine(page, '年', customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 25), 400);
    const currentMonth = (new Date().getMonth() + 1) + "";
    addTextWithFixedWidthAndUnderline(page, currentMonth, customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 26), 400, getWidth(customFont, baseFontSize, 1));
    addLine(page, '月', customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 27), 400);
    const currentDay = new Date().getDate() + "";
    addTextWithFixedWidthAndUnderline(page, currentDay, customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 28), 400, getWidth(customFont, baseFontSize, 1));
    addLine(page, '日', customFont, baseFontSize, 60 + getWidth(customFont, baseFontSize, 29), 400);
    addRightAlignedText(page, '支部签章：       ', customFont, baseFontSize, 370);
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
}



module.exports.generatePdf = generatePdf;