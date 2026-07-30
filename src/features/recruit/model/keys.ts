export const recruitKeys = {
  all: ['recruit'] as const,
  latest: () => [...recruitKeys.all, 'latest'] as const,
  editForm: () => [...recruitKeys.all, 'edit-session'] as const,
};
