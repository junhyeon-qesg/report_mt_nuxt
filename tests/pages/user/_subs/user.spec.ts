// tests/pages/user/_subs/user.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useMajorFormStore, useMajorListStore } from '~~/src/pages/user/_subs/user';
import { generateUsers } from '~~/src/pages/user/_subs/mock';
import { setupPinia } from '~~/tests/utils.test';

let freshUsers = generateUsers(200);

// Mock the getMockUsers function to provide a fresh, consistent dataset for each test.
vi.mock('~~/src/pages/user/_subs/mock', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    getMockUsers: () => freshUsers,
  };
});

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('User List Stores (_subs/user.ts)', () => {
  beforeEach(() => {
    setupPinia();
    freshUsers = generateUsers(200);
  });

  describe('useMajorFormStore', () => {
    it('onReset should reset form model and refetch list', () => {
      const formStore = useMajorFormStore();
      const listStore = useMajorListStore();
      const refetchSpy = vi.spyOn(listStore, 'refetch');

      formStore.formModel.searchValue = 'test';
      formStore.onReset();

      expect(formStore.formModel.searchValue).toBe('');
      expect(formStore.formModel.searchType).toBe('nickname');
      expect(formStore.formModel.createdAt).toBe(null);
      expect(refetchSpy).toHaveBeenCalled();
    });

    it('onSubmit should validate and refetch list', () => {
      const formStore = useMajorFormStore();
      const listStore = useMajorListStore();
      const refetchSpy = vi.spyOn(listStore, 'refetch');

      formStore.formRef = {
        validate: (callback: (errors: boolean) => void) => {
          callback(false); // no errors
        },
      } as any;

      formStore.onSubmit(new Event('submit'));

      expect(refetchSpy).toHaveBeenCalled();
    });
  });

  describe('useMajorListStore', () => {
    it('refetch should load first page of users', async () => {
      const listStore = useMajorListStore();

      await listStore.refetch();

      expect(listStore.isLoading).toBe(false);
      expect(listStore.error).toBe(null);
      expect(listStore.dataList.length).toBe(10); // default page size
      expect(listStore.dataList[0].userId).toBe(freshUsers[0].userId);
      expect(listStore.pagination.itemCount).toBe(freshUsers.length);
    });

    it('updateSearchParams should update search parameters and reset page', () => {
      const listStore = useMajorListStore();
      listStore.pagination.page = 5;

      listStore.updateSearchParams({
        searchType: 'loginId',
        searchValue: 'test',
        createdAt: [1672531200000, 1675209599000], // 2023-01-01 to 2023-01-31
      });

      expect(listStore.searchParams.loginId).toBe('test');
      expect(listStore.searchParams.createdAfter).toBe('2023-01-01');
      expect(listStore.searchParams.createdBefore).toBe('2023-01-31');
      expect(listStore.pagination.page).toBe(1);
    });

    it('should filter data correctly', async () => {
      const listStore = useMajorListStore();
      listStore.updateSearchParams({
        searchType: 'nickname',
        searchValue: 'User 10',
        createdAt: null,
      });

      await listStore.refetch();
      expect(listStore.pagination.itemCount).toBe(11); // User 10, User 100-109
      expect(listStore.dataList.every(u => u.nickname?.includes('User 10'))).toBe(true);
    });
  });
});
