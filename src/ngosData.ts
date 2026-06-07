/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NGO } from './types.ts';

export const INITIAL_NGOS_DATABASE: NGO[] = [
  {
    id: "ngo-goonj",
    name: "Goonj",
    website: "https://goonj.org",
    sector: "Education",
    headquarters: "New Delhi, Delhi",
    keyInitiatives: ["Cloth for Work", "School to School", "Green by Goonj", "Rahat"],
    description: "Goonj is a multi-award-winning social enterprise that focuses on disaster relief, humanitarian aid, and community development. It uses underutilized urban materials (like clothes and paper) as a parallel currency for development work in rural India.",
    establishedYear: 1999,
    impactSummary: "Over 3,000 tons of material processed and repurposed annually, reaching thousands of villages across 21 states.",
    isCustom: false,
    notes: "A pioneer in recycling urban waste into rural developmental resources. Their 'Cloth for Work' model values human dignity over charity."
  },
  {
    id: "ngo-pratham",
    name: "Pratham Education Foundation",
    website: "https://www.pratham.org",
    sector: "Education",
    headquarters: "Mumbai, Maharashtra",
    keyInitiatives: ["Read India", "ASER (Annual Status of Education Report)", "Second Chance", "Pratham Digital"],
    description: "Pratham is one of India's largest non-governmental organizations working to provide high-quality education to underprivileged children. It focuses on high-impact, low-cost interventions to address gaps in learning and literacy.",
    establishedYear: 1995,
    impactSummary: "Directly helps over 1 million children annually and evaluates learning levels in 600+ rural districts through the ASER report.",
    isCustom: false,
    notes: "Their ASER survey is the primary benchmark utilized by the Indian government and researchers to evaluate rural educational learning status."
  },
  {
    id: "ngo-sewa",
    name: "SEWA (Self Employed Women's Association)",
    website: "https://www.sewa.org",
    sector: "Women Empowerment",
    headquarters: "Ahmedabad, Gujarat",
    keyInitiatives: ["SEWA Bank", "SEWA Cooperative Federation", "Ansuya (Magazine)", "Shramshakti Campaign"],
    description: "SEWA is a trade union of poor, self-employed female workers who earn a living through their own labor or small businesses. It promotes self-reliance through full employment, micro-loans, healthcare, and child care.",
    establishedYear: 1972,
    impactSummary: "Over 2 million registered women members, making it the largest informal worker union in India and a worldwide role model.",
    isCustom: false,
    notes: "Founded by legendary activist Ela Bhatt. Provides an incredible model of democratic governance and microfinance owned by women."
  },
  {
    id: "ngo-smile",
    name: "Smile Foundation",
    website: "https://www.smilefoundationindia.org",
    sector: "Healthcare",
    headquarters: "New Delhi, Delhi",
    keyInitiatives: ["Smile on Wheels", "Mission Education", "Swabhiman (Women Empowerment)", "Smile Twin e-Learning Program"],
    description: "Smile Foundation works toward the education, healthcare, and livelihood of children and women. They use a venture philanthropy model to monitor, fund, and optimize local community projects across India.",
    establishedYear: 2002,
    impactSummary: "Covers 400+ projects in 25 states, directly benefiting over 1.5 million underprivileged children and women families.",
    isCustom: false,
    notes: "Uses corporate partnership models extensively. Highly professional execution with clear audit trails for social accountability."
  },
  {
    id: "ngo-cry",
    name: "CRY (Child Rights and You)",
    website: "https://www.cry.org",
    sector: "Healthcare",
    headquarters: "Mumbai, Maharashtra",
    keyInitiatives: ["Campaign for Child Education", "Stop Child Labor Drive", "Child Health and Nutrition", "Gender Sensitization"],
    description: "CRY works with grassroots organizations to address the root causes of child exploitation, poverty, and lack of opportunities. They advocate for child rights, education, nutrition, and vaccination priorities.",
    establishedYear: 1979,
    impactSummary: "Impacted more than 3 million children, successfully preventing child marriage and child labor in hundreds of villages.",
    isCustom: false,
    notes: "Started by Rippan Kapur with only Rs 50. Shows the power of persistent advocacy and systemic change for kids' core rights."
  },
  {
    id: "ngo-akshayapatra",
    name: "The Akshaya Patra Foundation",
    website: "https://www.akshayapatra.org",
    sector: "Healthcare",
    headquarters: "Bengaluru, Karnataka",
    keyInitiatives: ["Mid-Day Meal Scheme", "Anganwadi Feeding", "Deen Dayal Rasoi", "Emergency Relief Feeds"],
    description: "Akshaya Patra operates the largest school lunch program in the world. It provides nutritious meals to children studying in government and government-aided schools to eliminate hunger and increase school attendance.",
    establishedYear: 2000,
    impactSummary: "Serves over 2.2 million children daily across 24,000+ government schools in 16 Indian states and union territories.",
    isCustom: false,
    notes: "Runs state-of-the-art automated mega-kitchens leveraging robust food supply chains to safely produce fresh meals within hours."
  },
  {
    id: "ngo-helpage",
    name: "HelpAge India",
    website: "https://www.helpageindia.org",
    sector: "Healthcare",
    headquarters: "New Delhi, Delhi",
    keyInitiatives: ["Mobile Healthcare Units (MHUs)", "Sponsor-A-Grandparent", "Elder Helpline (14567)", "Physiotherapy clinics"],
    description: "HelpAge India is a prominent voice advocating for the rights, healthcare, and support of the elderly. It implements age-care programs, free medical treatments, cataract surgeries, livelihood support, and disaster response.",
    establishedYear: 1978,
    impactSummary: "Supports over 1.2 million elders through high-reach mobile clinics, national toll-free helpdesks, and custom livelihood programs.",
    isCustom: false,
    notes: "Excellent focus on geriatric healthcare. In India, where senior social security is sparse, they fill a critical societal gap."
  },
  {
    id: "ngo-pfa",
    name: "People for Animals (PFA)",
    website: "https://www.peopleforanimalsindia.org",
    sector: "Animal Welfare",
    headquarters: "New Delhi, Delhi",
    keyInitiatives: ["Animal Shelter Development", "Animal Ambulances", "Legislative Advocacy for Animal Laws", "Sterilization Drives"],
    description: "Founded by Maneka Gandhi, PFA is India's largest animal welfare organization. It runs a network of 36 units and shelters across the country to rescue, treat, and rehabilitate sick, injured, and abandoned animals.",
    establishedYear: 1992,
    impactSummary: "Rescues and treats over 200,000 domestic, street, and wild animals annually via nationwide shelters.",
    isCustom: false,
    notes: "Key force behind strengthening India's Prevention of Cruelty to Animals Act. Very vocal on wildlife conservation and vegetarianism."
  },
  {
    id: "ngo-chintan",
    name: "Chintan Environmental Research and Action Group",
    website: "https://www.chintan-india.org",
    sector: "Environmental Conservation",
    headquarters: "New Delhi, Delhi",
    keyInitiatives: ["Waste-picker Upliftment", "Scavengers to Waste Managers", "Plastics Reduction", "Air Quality Protection"],
    description: "Chintan is a sustainable development NGO working for environmental justice. They partner with waste-pickers, poor waste scavengers, and schoolchildren, turning hazardous waste-scavenging into clean green job cooperatives.",
    establishedYear: 1999,
    impactSummary: "Enables thousands of informal waste pickers to earn formal livelihoods and diverts 30+ metric tons of waste daily from toxic landfills.",
    isCustom: false,
    notes: "Unique intersection of environmental preservation and social justice. Recognized globally by the UN for green livelihoods."
  },
  {
    id: "ngo-wti",
    name: "Wildlife Trust of India (WTI)",
    website: "https://www.wti.org.in",
    sector: "Environmental Conservation",
    headquarters: "Noida, Uttar Pradesh",
    keyInitiatives: ["Wild Aid (Disaster Rescue)", "Elephant Corridors Protection", "Human-Wildlife Conflict Settlement", "Green Corridor Champions"],
    description: "WTI is a leading national conservation organization working to secure and protect India's wildlife and their habitats. They partner with local tribal communities and governments to prevent poaching and establish migratory corridors.",
    establishedYear: 1998,
    impactSummary: "Successfully secured over 100 elephant transit corridors and rescued thousands of wild animals in Kaziranga and beyond.",
    isCustom: false,
    notes: "Employs technical conservationists, ecologists, and lawyers to provide on-the-ground answers to conserve vulnerable wildlife."
  }
];
