export interface LawSection {
  section: number;
  offence: string;
  keywords: string[];
  punishment: string;
}

export const consumerLawSections: LawSection[] = [
  {
    section: 37,
    offence: "Selling goods without proper cover or missing required label information (weight, amount, ingredients, MRP, manufacture and expiry date).",
    keywords: ["no label", "missing label", "no cover", "wrong label", "mismatch label", "missing expiry", "missing mrp", "missing weight"],
    punishment: "Up to 1 year imprisonment or up to 50,000 TK fine or both."
  },
  {
    section: 38,
    offence: "Failure to display price list of goods at a visible place in the shop.",
    keywords: ["no price list", "price list missing", "no price display", "shop price hide", "price hide"],
    punishment: "Up to 1 year imprisonment or up to 50,000 TK fine or both."
  },
  {
    section: 39,
    offence: "Service provider failing to preserve or display service price list.",
    keywords: ["service price missing", "no service list", "no service price", "service cost not shown"],
    punishment: "Up to 1 year imprisonment or up to 50,000 TK fine or both."
  },
  {
    section: 40,
    offence: "Selling goods, medicine, or service at a higher price than fixed by law.",
    keywords: ["overpriced", "extra charge", "took extra money", "higher price", "price high", "too expensive unfair", "extra taka"],
    punishment: "Up to 1 year imprisonment or up to 50,000 TK fine or both."
  },
  {
    section: 41,
    offence: "Knowingly selling adulterated goods or medicine.",
    keywords: ["adulterated", "mixed substances", "chemical mixed", "impure", "food mixed", "medicine adulterated"],
    punishment: "Up to 3 years imprisonment or up to 200,000 TK fine or both."
  },
  {
    section: 42,
    offence: "Mixing prohibited or harmful ingredients in food.",
    keywords: ["harmful mixed", "poison", "toxic food", "prohibited ingredient", "dangerous chemical", "food chemical"],
    punishment: "Up to 3 years imprisonment or up to 200,000 TK fine or both."
  },
  {
    section: 43,
    offence: "Manufacturing or processing goods in an illegal or unsafe method harmful to health.",
    keywords: ["illegal manufacturing", "unsafe factory", "unsafe process", "dangerous production"],
    punishment: "Up to 2 years imprisonment or up to 100,000 TK fine or both."
  },
  {
    section: 44,
    offence: "Deceiving consumers through false or misleading advertisement.",
    keywords: ["false ad", "fake advertisement", "misleading ad", "lying advertisement"],
    punishment: "Up to 1 year imprisonment or up to 200,000 TK fine or both."
  },
  {
    section: 45,
    offence: "Not selling or delivering goods/services properly after taking payment.",
    keywords: ["did not deliver", "did not give product", "service not delivered", "paid but not received", "item missing after payment"],
    punishment: "Up to 1 year imprisonment or up to 50,000 TK fine or both."
  },
  {
    section: 46,
    offence: "Supplying less weight than promised.",
    keywords: ["less weight", "weight short", "cheated weight", "gave less weight", "not full weight"],
    punishment: "Up to 1 year imprisonment or up to 50,000 TK fine or both."
  },
  {
    section: 47,
    offence: "Using tampered or fraudulent measuring scales showing more than actual weight.",
    keywords: ["fake scale", "wrong weight machine", "tampered weight machine", "weight machine cheating"],
    punishment: "Up to 1 year imprisonment or up to 50,000 TK fine or both."
  },
  {
    section: 48,
    offence: "Supplying goods with less quantity or length than offered.",
    keywords: ["less quantity", "less measurement", "short length", "gave less than promised"],
    punishment: "Up to 1 year imprisonment or up to 50,000 TK fine or both."
  },
  {
    section: 50,
    offence: "Making or manufacturing fake goods.",
    keywords: ["fake product", "counterfeit", "duplicate item", "fake brand", "false brand"],
    punishment: "Up to 3 years imprisonment or up to 200,000 TK fine or both."
  },
  {
    section: 51,
    offence: "Selling expired goods or medicine.",
    keywords: ["expired", "date over", "expiry passed", "old product", "outdated product"],
    punishment: "Up to 1 year imprisonment or up to 50,000 TK fine or both."
  },
  {
    section: 52,
    offence: "Any act dangerous to the life or security of a consumer.",
    keywords: ["dangerous service", "life risk", "unsafe product", "risking life", "unsafe transport"],
    punishment: "Up to 3 years imprisonment or up to 200,000 TK fine or both."
  },
  {
    section: 53,
    offence: "Negligence, irresponsibility, or carelessness by service provider causing financial or health damage.",
    keywords: ["negligence", "careless service", "doctor negligent", "hospital negligence", "service harmed me"],
    punishment: "Up to 3 years imprisonment or up to 200,000 TK fine or both."
  },
  {
    section: 54,
    offence: "Filing false or vexatious complaints to harass or defame someone.",
    keywords: ["false case", "fake complaint", "wrong allegation intentionally"],
    punishment: "Up to 3 years imprisonment or up to 50,000 TK fine or both."
  }
];

export function findApplicableSections(issueTypes: string[], details: string): LawSection[] {
  const applicableSections: LawSection[] = [];
  const detailsLower = details.toLowerCase();
  
  // Map issue types to keywords
  const issueKeywords: { [key: string]: string[] } = {
    overpricing: ["overpriced", "extra charge", "higher price", "price high"],
    fraud: ["fake", "counterfeit", "false"],
    adulteration: ["adulterated", "mixed substances", "impure"],
    misleading: ["false ad", "fake advertisement", "misleading"],
    overcharging: ["extra charge", "took extra money"],
    negligence: ["negligence", "careless"],
    defective: ["unsafe", "dangerous"],
    delay: ["did not deliver", "service not delivered"],
    unauthorized: ["without permission"],
    warranty: ["warranty issue"],
    refund: ["did not give", "not received"],
    damage: ["harmful", "health damage"],
  };

  // Check each section
  for (const section of consumerLawSections) {
    let matchScore = 0;

    // Check if any keywords match the details
    for (const keyword of section.keywords) {
      if (detailsLower.includes(keyword.toLowerCase())) {
        matchScore += 2;
      }
    }

    // Check if issue types relate to this section
    for (const issueType of issueTypes) {
      const keywords = issueKeywords[issueType] || [];
      for (const keyword of keywords) {
        for (const sectionKeyword of section.keywords) {
          if (sectionKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
              keyword.toLowerCase().includes(sectionKeyword.toLowerCase())) {
            matchScore += 1;
          }
        }
      }
    }

    if (matchScore > 0) {
      applicableSections.push(section);
    }
  }

  // If no specific match, add default sections based on issue types
  if (applicableSections.length === 0) {
    // Add section 40 for overpricing/overcharging
    if (issueTypes.includes('overpricing') || issueTypes.includes('overcharging')) {
      applicableSections.push(consumerLawSections.find(s => s.section === 40)!);
    }
    // Add section 41 for adulteration
    if (issueTypes.includes('adulteration')) {
      applicableSections.push(consumerLawSections.find(s => s.section === 41)!);
    }
    // Add section 44 for misleading/fraud
    if (issueTypes.includes('misleading') || issueTypes.includes('fraud')) {
      applicableSections.push(consumerLawSections.find(s => s.section === 44)!);
    }
    // Add section 53 for negligence
    if (issueTypes.includes('negligence')) {
      applicableSections.push(consumerLawSections.find(s => s.section === 53)!);
    }
    // Add section 45 for not delivering
    if (issueTypes.includes('delay') || issueTypes.includes('refund')) {
      applicableSections.push(consumerLawSections.find(s => s.section === 45)!);
    }
  }

  // Remove duplicates and sort by section number
  const uniqueSections = Array.from(new Map(applicableSections.map(s => [s.section, s])).values());
  return uniqueSections.sort((a, b) => a.section - b.section);
}
