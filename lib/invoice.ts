import { jsPDF } from 'jspdf';

interface InvoiceData {
    invoiceNumber: string;
    date: string;
    customerName: string;
    customerAddress: string;
    items: {
        description: string;
        amount: number;
    }[];
    totalAmount: number;
    status: string;
}

export const generateInvoicePDF = (data: InvoiceData) => {
    const doc = new jsPDF();

    // -- Header --
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('INVOICE', 160, 20);

    doc.setFontSize(16);
    doc.text('PingTap Broadband', 20, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('123 Fiber Street, Digital City', 20, 26);
    doc.text('Support: +91 98765 43210', 20, 31);
    doc.text('Email: billing@pingtap.com', 20, 36);

    // -- Divider --
    doc.setDrawColor(200);
    doc.line(20, 45, 190, 45);

    // -- Invoice Details --
    doc.setFontSize(10);
    doc.setTextColor(0);

    // Right Side: Invoice Meta
    doc.text(`Invoice #: ${data.invoiceNumber}`, 140, 60);
    doc.text(`Date: ${data.date}`, 140, 65);
    doc.text(`Status: ${data.status.toUpperCase()}`, 140, 70);

    // Left Side: Bill To
    doc.setFontSize(11);
    doc.text('Bill To:', 20, 60);
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(data.customerName, 20, 66);

    // Split address if too long
    const splitAddress = doc.splitTextToSize(data.customerAddress || 'N/A', 80);
    doc.text(splitAddress, 20, 71);

    // -- Table Header --
    const startY = 100;
    doc.setFillColor(245, 247, 250);
    doc.rect(20, startY, 170, 10, 'F');
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', 25, startY + 7);
    doc.text('Amount (INR)', 160, startY + 7);

    // -- Table Rows --
    let scrollY = startY + 18;
    doc.setFont('helvetica', 'normal');

    data.items.forEach(item => {
        doc.text(item.description, 25, scrollY);
        doc.text(item.amount.toFixed(2), 160, scrollY);
        scrollY += 10;
    });

    // -- Divider --
    doc.line(20, scrollY, 190, scrollY);
    scrollY += 10;

    // -- Total --
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 130, scrollY);
    doc.text(`INR ${data.totalAmount.toFixed(2)}`, 160, scrollY);

    // -- Footer --
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Thank you for choosing PingTap Broadband.', 20, 270);
    doc.text('This is a computer generated invoice.', 20, 275);

    return doc;
};
