export const adminKeys = {
  all: ['admin'] as const,
  recruits: () => [...adminKeys.all, 'recruits'] as const,
  recruit: (recruitId: string) => [...adminKeys.recruits(), recruitId] as const,
  recruitForms: (recruitId: string) => [...adminKeys.recruit(recruitId), 'forms'] as const,
  recruitForm: (recruitId: string, formId: string) =>
    [...adminKeys.recruitForms(recruitId), formId] as const,
  recruitSms: (recruitId: string) => [...adminKeys.recruit(recruitId), 'sms'] as const,
  users: (page: number, query = '') => [...adminKeys.all, 'users', { page, query }] as const,
  preUsers: (page: number, query = '') => [...adminKeys.all, 'pre-users', { page, query }] as const,
  activities: (page: number, query = '') =>
    [...adminKeys.all, 'activities', { page, query }] as const,
};
