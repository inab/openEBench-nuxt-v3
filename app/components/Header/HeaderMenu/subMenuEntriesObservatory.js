// Displayed in Header and Footer

const tabsItems = [
  {
    label: "Overview",
    slot: "overview",
    icon: "i-pajamas-overview",
    path: "observatory/Overview",
    index: 0,
  },
  {
    label: "Trends",
    slot: "trends",
    icon: "i-charm-chart-line",
    path: "observatory/Trends",
    index: 1,
  },
  {
    label: "FAIRness Scoreboard",
    slot: "fairness",
    icon: "i-charm-disc",
    path: "observatory/FAIRness",
    index: 2,
  },
  {
    label: "FAIRsoft Evaluator",
    slot: "fairsoft",
    icon: "i-cil-check-circle",
    path: "observatory/Evaluation",
    index: 3,
  },
  {
    label: "Data",
    slot: "data",
    icon: "i-dashicons-database",
    path: "observatory/Data",
    index: 4,
  },
  
];

export default tabsItems;
