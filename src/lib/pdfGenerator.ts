/**
 * Generate a properly formatted Bangladesh Government complaint document as PDF
 * This creates a professional document matching the format expected by 
 * National Consumer Rights Protection Directorate (জাতীয় ভোক্তা অধিকার সংরক্ষণ অধিদপ্তর)
 * 
 * Uses HTML rendering for proper Bengali font support
 */

interface ComplaintData {
  issueTypes: string[];
  shopName: string;
  dateOfOccurrence: string;
  productName?: string;
  amountPaid?: string;
  advertisedPrice?: string;
  expectedPrice?: string;
  actualPrice?: string;
  billAmount?: string;
  serviceType?: string;
  warrantyPeriod?: string;
  purchaseDate?: string;
  refundAmount?: string;
  damageDescription?: string;
  delayDuration?: string;
  unauthorizedCharge?: string;
  details: string;
  images?: string[];
}

interface UserInfo {
  name: string;
  nid?: string;
  phone?: string;
  presentAddress?: {
    street?: string;
    city?: string;
    district?: string;
    postalCode?: string;
  };
}

const getIssueLabel = (value: string): string => {
  const issueMap: { [key: string]: string } = {
    overpricing: "অতিমূল্য (Overpricing)",
    fraud: "প্রতারণা (Fraud)",
    adulteration: "ভেজাল (Adulteration)",
    misleading: "ভ্রান্তিকর বিজ্ঞাপন (Misleading Advertisement)",
    overcharging: "অতিরিক্ত বিল (Overcharging)",
    negligence: "অবহেলা (Negligence)",
    defective: "ত্রুটিযুক্ত পণ্য (Defective Product)",
    harassment: "হয়রানি (Harassment)",
    delay: "বিলম্ব (Delay)",
    unauthorized: "অননুমোদিত সেবা/চার্জ (Unauthorized Service/Charge)",
    warranty: "ওয়ারেন্টি সংক্রান্ত সমস্যা (Warranty Issue)",
    refund: "ফেরত না পাওয়া (Refund Not Received)",
    damage: "ক্ষতিগ্রস্ত পণ্য (Damaged Product)",
    scam: "স্ক্যাম (Scam)",
    violation: "আইন লঙ্ঘন (Law Violation)"
  };
  return issueMap[value] || value;
};

const generateHTMLContent = (complaint: ComplaintData, userInfo?: UserInfo) => {
  const issueLabels = complaint.issueTypes.map(type => getIssueLabel(type)).join(', ');
  
  // Use user info if available, otherwise keep placeholder
  const userName = userInfo?.name || '[আপনার নাম]';
  const userAddress = userInfo?.presentAddress 
    ? [
        userInfo.presentAddress.street,
        userInfo.presentAddress.city,
        userInfo.presentAddress.district,
        userInfo.presentAddress.postalCode
      ].filter(Boolean).join(', ') || '[আপনার ঠিকানা]'
    : '[আপনার ঠিকানা]';
  const userPhone = userInfo?.phone || '[আপনার মোবাইল নম্বর]';
  const userNID = userInfo?.nid || '[আপনার এনআইডি]';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @font-face {
      font-family: 'SutonnyMJ';
      src: url('https://fonts.cdnfonts.com/css/sutonnymj') format('woff2');
      font-weight: normal;
      font-style: normal;
    }
    
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'SutonnyMJ', 'Noto Sans Bengali', sans-serif;
      line-height: 1.8;
      padding: 60px;
      max-width: 900px;
      margin: 0 auto;
      color: #000;
      background: white;
      font-size: 14px;
    }
    .header {
      text-align: center;
      margin-bottom: 35px;
      border-bottom: 2px solid #333;
      padding-bottom: 20px;
    }
    .govt-logo {
      background: #e8e8e8;
      height: 60px;
      width: 140px;
      margin: 0 auto 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      border-radius: 4px;
      padding: 10px;
    }
    h1 {
      font-size: 22px;
      margin: 8px 0;
      font-weight: bold;
      line-height: 1.4;
    }
    h2 {
      font-size: 18px;
      margin: 8px 0;
      font-weight: normal;
      line-height: 1.4;
    }
    .section {
      margin: 25px 0;
      padding: 0 10px;
    }
    .section p {
      margin: 10px 0;
      text-align: justify;
    }
    .subject {
      font-weight: bold;
      margin: 20px 0;
      padding: 0 10px;
      font-size: 15px;
    }
    .detail-row {
      margin: 10px 0;
      padding-left: 30px;
      line-height: 1.6;
    }
    .label {
      font-weight: bold;
      display: inline-block;
      min-width: 160px;
      margin-right: 10px;
    }
    .signature-section {
      margin-top: 50px;
      padding: 0 10px;
    }
    .signature-line {
      border-top: 1.5px solid #000;
      width: 220px;
      margin: 25px 0 12px 0;
    }
    strong {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="govt-logo">Government of Bangladesh</div>
    <h1>National Consumer Rights Protection Directorate</h1>
    <h2>জাতীয় ভোক্তা অধিকার সংরক্ষণ অধিদপ্তর</h2>
  </div>

  <div class="section">
    <p><strong>বরাবর,</strong></p>
    <p style="margin-left: 20px;">মহাপরিচালক<br>
    জাতীয় ভোক্তা অধিকার সংরক্ষণ অধিদপ্তর<br>
    ঢাকা, বাংলাদেশ</p>
  </div>

  <div class="subject">
    <strong>বিষয়:</strong> ${issueLabels} সংক্রান্ত অভিযোগ
  </div>

  <div class="section">
    <p><strong>জনাব,</strong></p>
    <p>বিনীত নিবেদন এই যে, আমি ${userName}, এনআইডি: ${userNID}, স্থায়ী ঠিকানা: ${userAddress}, মোবাইল: ${userPhone}, এই মর্মে আনুষ্ঠানিক অভিযোগ দাখিল করছি।</p>
  </div>

  <div class="section">
    <p><strong>অভিযোগের বিবরণ:</strong></p>
    <div class="detail-row"><span class="label">প্রতিষ্ঠানের নাম:</span> ${complaint.shopName}</div>
    <div class="detail-row"><span class="label">ঘটনার তারিখ:</span> ${complaint.dateOfOccurrence}</div>
    ${complaint.productName ? `<div class="detail-row"><span class="label">পণ্য:</span> ${complaint.productName}</div>` : ''}
    ${complaint.serviceType ? `<div class="detail-row"><span class="label">সেবার ধরন:</span> ${complaint.serviceType}</div>` : ''}
    ${complaint.amountPaid ? `<div class="detail-row"><span class="label">প্রদত্ত মূল্য:</span> ${complaint.amountPaid} টাকা</div>` : ''}
    ${complaint.advertisedPrice ? `<div class="detail-row"><span class="label">বিজ্ঞাপিত মূল্য:</span> ${complaint.advertisedPrice} টাকা</div>` : ''}
    ${complaint.actualPrice ? `<div class="detail-row"><span class="label">প্রকৃত মূল্য:</span> ${complaint.actualPrice} টাকা</div>` : ''}
    ${complaint.expectedPrice ? `<div class="detail-row"><span class="label">প্রত্যাশিত বিল:</span> ${complaint.expectedPrice} টাকা</div>` : ''}
    ${complaint.billAmount ? `<div class="detail-row"><span class="label">আরোপিত বিল:</span> ${complaint.billAmount} টাকা</div>` : ''}
    ${complaint.purchaseDate ? `<div class="detail-row"><span class="label">ক্রয়ের তারিখ:</span> ${complaint.purchaseDate}</div>` : ''}
    ${complaint.warrantyPeriod ? `<div class="detail-row"><span class="label">ওয়ারেন্টি মেয়াদ:</span> ${complaint.warrantyPeriod}</div>` : ''}
    ${complaint.refundAmount ? `<div class="detail-row"><span class="label">প্রত্যাশিত ফেরত:</span> ${complaint.refundAmount} টাকা</div>` : ''}
    ${complaint.delayDuration ? `<div class="detail-row"><span class="label">বিলম্বের সময়কাল:</span> ${complaint.delayDuration}</div>` : ''}
    ${complaint.unauthorizedCharge ? `<div class="detail-row"><span class="label">অননুমোদিত চার্জ:</span> ${complaint.unauthorizedCharge}</div>` : ''}
  </div>

  <div class="section">
    <p><strong>বিস্তারিত বিবরণ:</strong></p>
    <p style="margin-left: 20px;">${complaint.details}</p>
    ${complaint.damageDescription ? `<p><strong>ক্ষতির বিবরণ:</strong></p><p style="margin-left: 20px;">${complaint.damageDescription}</p>` : ''}
  </div>

  <div class="section">
    <p>উপরোক্ত ঘটনায় ভোক্তা অধিকার সংরক্ষণ আইন, ২০০৯ এর প্রাসঙ্গিক ধারা লঙ্ঘিত হয়েছে বলে আমি মনে করি। এই বিষয়ে যথাযথ আইনানুগ ব্যবস্থা গ্রহণের জন্য বিনীত অনুরোধ করছি।</p>
  </div>

  <div class="section">
    <p><strong>সংযুক্তি:</strong></p>
    <p style="margin-left: 20px;">১. প্রাসঙ্গিক রশিদ/বিল (যদি থাকে)<br>
    ২. প্রমাণপত্র/ছবি ${complaint.images && complaint.images.length > 0 ? `(${complaint.images.length}টি সংযুক্ত)` : '(যদি থাকে)'}</p>
  </div>

  ${complaint.images && complaint.images.length > 0 ? `
  <div class="section">
    <p><strong>প্রমাণ চিত্র:</strong></p>
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 10px;">
      ${complaint.images.map((url, index) => `
        <div style="text-align: center;">
          <img src="${url}" alt="প্রমাণ ${index + 1}" style="max-width: 100%; max-height: 200px; border: 1px solid #ddd; border-radius: 4px;" crossorigin="anonymous" />
          <p style="font-size: 11px; margin-top: 5px;">প্রমাণ ${index + 1}</p>
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}

  <div class="signature-section">
    <p><strong>বিনীত নিবেদক,</strong></p>
    <div class="signature-line"></div>
    <p>স্বাক্ষর</p>
    <p>নাম: ${userName}</p>
    <p>তারিখ: ${new Date().toLocaleDateString('bn-BD')}</p>
    <p>মোবাইল: ${userPhone}</p>
  </div>

  <div class="section">
    <p><strong>সাক্ষী (যদি থাকে):</strong></p>
    <p style="margin-left: 20px;">১. নাম: _________________ ঠিকানা: _________________</p>
    <p style="margin-left: 20px;">২. নাম: _________________ ঠিকানা: _________________</p>
  </div>

  <div style="text-align: center; margin-top: 40px; font-size: 10px; font-style: italic; color: #666;">
    This is a computer-generated document from ComplainCraft
  </div>
</body>
</html>
  `;
};

export const generateComplaintPDF = async (
  complaint: ComplaintData,
  userInfo?: UserInfo
) => {
  try {
    // Dynamic imports
    const { default: html2canvas } = await import('html2canvas');
    const { default: jsPDF } = await import('jspdf');

    // Create a temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '800px';
    container.style.background = 'white';
    container.innerHTML = generateHTMLContent(complaint, userInfo);
    document.body.appendChild(container);

    // Wait for fonts to load
    await document.fonts.ready;

    // Give a moment for rendering
    await new Promise(resolve => setTimeout(resolve, 500));

    // Generate canvas from HTML
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Remove temporary container
    document.body.removeChild(container);

    // Create PDF
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF({
      orientation: imgHeight > 297 ? 'portrait' : 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png');
    
    if (imgHeight <= 297) {
      // Single page
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
      // Multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      const pageHeight = 297;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
    }

    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const filename = `Complaint-${complaint.shopName.replace(/[^a-zA-Z0-9]/g, '_')}-${date}.pdf`;

    // Save PDF
    pdf.save(filename);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};
