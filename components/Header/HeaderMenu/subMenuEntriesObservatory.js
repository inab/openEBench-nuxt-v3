// Displayed in Header and Footer

const tabsItems = [
  {
    label: "Trends",
    slot: "trends",
    icon: "i-charm-chart-line",
    path: "observatory/Trends",
    index: 0,
  },
  {
    label: "FAIRness Scoreboard",
    slot: "fairness",
    icon: "i-charm-disc",
    path: "observatory/FAIRness",
    index: 1,
  },
  {
    label: "FAIRsoft Evaluator",
    slot: "fairsoft",
    icon: "i-cil-check-circle",
    path: "observatory/Evaluation",
    index: 2,
  },
  {
    label: "Data",
    slot: "data",
    icon: "i-dashicons-database",
    path: "observatory/Data",
    index: 3,
  },
  {
    label: "About",
    slot: "about",
    icon: "i-zondicons-information-solid",
    path: "observatory/About",
    index: 4,
  },
];

export default tabsItems;
