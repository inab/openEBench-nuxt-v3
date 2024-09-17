export const CommunityStatusColors: { [key: string]: string } = {
    active: 'bg-green-200',
    archived: 'bg-neutral-300',
    incubating: 'bg-teal-200',
};

export const CommunityStatusLabels: Array<{ value: string, label: string }> = [
    { value: 'active', label: 'Active' },
    { value: 'archived', label: 'Archived' },
    { value: 'incubating', label: 'Incubating' },
];