import { HealthMilestone } from '../types';

export const HEALTH_MILESTONES: HealthMilestone[] = [
  {
    id: '20_min',
    title: 'Heart Rate & Pulse Stabilize',
    durationMinutes: 20,
    timeLabel: '20 Minutes',
    description: 'Heart rate and blood pressure drop back toward baseline levels. Blood circulation begins to improve in extremities.',
    category: 'heart',
    source: 'World Health Organization (WHO) & American Heart Association',
    sourceUrl: 'https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation',
  },
  {
    id: '8_hours',
    title: 'Carbon Monoxide Clears',
    durationMinutes: 480, // 8 hrs
    timeLabel: '8 Hours',
    description: 'Carbon monoxide levels in your bloodstream fall by over half, allowing blood oxygen saturation to rise to normal healthy levels.',
    category: 'circulation',
    source: 'Centers for Disease Control and Prevention (CDC)',
    sourceUrl: 'https://www.cdc.gov/tobacco/quit_smoking/how_to_quit/benefits/index.htm',
  },
  {
    id: '24_hours',
    title: 'Cardiac Strain Decreases',
    durationMinutes: 1440, // 24 hrs
    timeLabel: '24 Hours',
    description: 'All residual carbon monoxide is exhaled. Your lungs begin clearing out mucus and smoking debris, and cardiac workload falls.',
    category: 'heart',
    source: 'NHS Smokefree UK',
    sourceUrl: 'https://www.nhs.uk/better-health/quit-smoking/',
  },
  {
    id: '48_hours',
    title: 'Nerve Endings, Taste & Smell Revive',
    durationMinutes: 2880, // 48 hrs
    timeLabel: '48 Hours',
    description: 'Damaged nerve endings start regenerating. Your senses of smell and taste sharpen noticeably as chemical dulling lifts.',
    category: 'sensory',
    source: 'CDC & American Cancer Society',
    sourceUrl: 'https://www.cancer.org/cancer/risk-prevention/tobacco/benefits-of-quitting-smoking-over-time.html',
  },
  {
    id: '72_hours',
    title: 'Bronchial Tubes Relax & Energy Surges',
    durationMinutes: 4320, // 72 hrs
    timeLabel: '72 Hours',
    description: 'Nicotine is largely metabolized out of the body. Bronchial tubes start relaxing, making deep breathing noticeably smoother and boosting stamina.',
    category: 'lungs',
    source: 'American Lung Association',
    sourceUrl: 'https://www.lung.org/quit-smoking/how-to-quit/benefits-of-quitting',
  },
  {
    id: '2_weeks',
    title: 'Circulation & Lung Function Surge',
    durationMinutes: 20160, // 14 days
    timeLabel: '2 - 12 Weeks',
    description: 'Blood flow to your heart and muscles improves significantly. Walking, exercising, and stairs feel markedly easier; lung performance jumps up to 30%.',
    category: 'circulation',
    source: 'World Health Organization (WHO)',
    sourceUrl: 'https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation',
  },
  {
    id: '1_month',
    title: 'Airway Cilia Reactivation',
    durationMinutes: 43200, // 30 days
    timeLabel: '1 - 9 Months',
    description: 'Microscopic cilia in your lungs have regrown and resumed sweeping mucus away. Coughing, sinus congestion, and shortness of breath subside.',
    category: 'lungs',
    source: 'CDC Smoking Cessation Report',
    sourceUrl: 'https://www.cdc.gov/tobacco/quit_smoking/how_to_quit/benefits/index.htm',
  },
  {
    id: '1_year',
    title: 'Coronary Heart Disease Risk Halved',
    durationMinutes: 525600, // 365 days
    timeLabel: '1 Year',
    description: 'Your excess risk of coronary heart disease drops to roughly half that of someone who continues smoking. A momentous cardiovascular recovery.',
    category: 'heart',
    source: 'U.S. Surgeon General / American Heart Association',
    sourceUrl: 'https://www.cancer.org/cancer/risk-prevention/tobacco/benefits-of-quitting-smoking-over-time.html',
  },
  {
    id: '5_years',
    title: 'Stroke Risk Normalizes',
    durationMinutes: 2628000, // 5 years
    timeLabel: '5 Years',
    description: 'Arteries have widened and healed. Your risk of having a stroke can fall to the level of a non-smoker (between 5 to 15 years after quitting).',
    category: 'long-term',
    source: 'World Health Organization (WHO)',
    sourceUrl: 'https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation',
  },
  {
    id: '10_years',
    title: 'Lung Cancer Risk Slashed by 50%',
    durationMinutes: 5256000, // 10 years
    timeLabel: '10 Years',
    description: 'Your risk of dying from lung cancer is roughly half that of a continuing smoker. Risks of cancer of the larynx, mouth, and esophagus decline substantially.',
    category: 'long-term',
    source: 'American Cancer Society',
    sourceUrl: 'https://www.cancer.org/cancer/risk-prevention/tobacco/benefits-of-quitting-smoking-over-time.html',
  },
  {
    id: '15_years',
    title: 'Heart Health at Non-Smoker Baseline',
    durationMinutes: 7884000, // 15 years
    timeLabel: '15 Years',
    description: 'Your risk of coronary heart disease is now close to that of someone who has never smoked in their lifetime.',
    category: 'long-term',
    source: 'World Health Organization (WHO)',
    sourceUrl: 'https://www.who.int/news-room/questions-and-answers/item/tobacco-health-benefits-of-smoking-cessation',
  },
];
