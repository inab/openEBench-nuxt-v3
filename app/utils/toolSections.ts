export interface ToolSection {
  id: string;
  title: string;
}

export const TOOL_SECTIONS: ToolSection[] = [
  { id: 'documentation', title: 'Documentation' },
  { id: 'availability', title: 'Availability' },
  { id: 'citation', title: 'Citation' },
  { id: 'licensing', title: 'Licensing' },
  { id: 'similar-software', title: 'Similar Software' },
];