# Dynamic Form Fields Guide

## How Fields Appear Based on Selected Issues

### Common Fields (Always Visible)
- Shop/Company Name *
- Date of Occurrence *
- Additional Details *

### Issue-Specific Fields

#### 1. **Overpricing (অতিমূল্য)**
- Product/Service Name *
- Amount Paid *
- Advertised/Market Price *

#### 2. **Fraud (প্রতারণা)**
- (No additional specific fields)

#### 3. **Adulteration (ভেজাল)**
- Product/Service Name *

#### 4. **Misleading (ভ্রান্তিকর বিজ্ঞাপন)**
- Advertised Price *
- Actual Price *

#### 5. **Overcharging (অতিরিক্ত বিল)**
- Expected Bill Amount *
- Charged Bill Amount *

#### 6. **Negligence (অবহেলা)**
- Service Type

#### 7. **Defective (ত্রুটিযুক্ত পণ্য)**
- Product/Service Name *

#### 8. **Harassment (হয়রানি)**
- Service Type

#### 9. **Delay (বিলম্ব)**
- Service Type
- Delay Duration *

#### 10. **Unauthorized (অননুমোদিত সেবা/চার্জ)**
- Service Type
- Unauthorized Charge/Service *

#### 11. **Warranty (ওয়ারেন্টি সংক্রান্ত সমস্যা)**
- Product/Service Name *
- Purchase Date *
- Warranty Period *

#### 12. **Refund (ফেরত না পাওয়া)**
- Refund Amount Expected *

#### 13. **Damage (ক্ষতিগ্রস্ত পণ্য)**
- Product/Service Name *
- Damage Description *

#### 14. **Scam (স্ক্যাম)**
- Product/Service Name *

#### 15. **Violation (আইন লঙ্ঘন সাধারণভাবে)**
- (No additional specific fields)

## Field Visibility Logic

### Product/Service Name appears when selecting:
- Overpricing
- Adulteration
- Defective
- Damage
- Warranty
- Scam

### Service Type appears when selecting:
- Negligence
- Harassment
- Delay
- Unauthorized

### Price-related fields appear when selecting:
- Overpricing (Amount Paid + Advertised Price)
- Misleading (Advertised Price + Actual Price)
- Overcharging (Expected Bill + Charged Bill)

## Notes
- Fields marked with * are required when the corresponding issue is selected
- Multiple issues can be selected, and all relevant fields will appear
- If both "Overpricing" and "Misleading" are selected, you'll see all price-related fields
