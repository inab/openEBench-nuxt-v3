export const CommunityStatusColors: { [key: string]: string } = {
  active: "bg-green-500",
  archived: "bg-pink-800",
  incubating: "bg-purple-700",
  abandoned: "bg-red-500",
};

export const CommunityStatusTextColors: { [key: string]: string } = {
  active: "#00caa4",
  archived: "#d7a31a",
  incubating: "#7b62b8",
  abandoned: "#800000",
};

export const CommunityStatusBackgroundColors: { [key: string]: string } = {
  active: "bg-statusActive-50",
  archived: "bg-statusArchived-50",
  incubating: "bg-statusIncubating-50",
  abandoned: "bg-statusAbandoned-50",
};

export const CommunityStatusLabels: Array<{ value: string; label: string }> = [
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
  { value: "incubating", label: "Incubating" },
  { value: "abandoned", label: "Abandoned" },
];
