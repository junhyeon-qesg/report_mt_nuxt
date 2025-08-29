// tests/pages/user/[id]/_subs/userDetail.spec.ts
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { storeToRefs } from 'pinia';
import { useMajorDetailStore, useMajorFormStore } from '~~/src/pages/user/[id]/_subs/userDetail';
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

const mockRouter = {
  push: vi.fn(),
};
const mockRoute = {
  params: { id: '1' },
};

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  useRoute: () => mockRoute,
}));

describe('User Detail Stores (_subs/userDetail.ts)', () => {
  beforeEach(() => {
    setupPinia();
    // Create a fresh user dataset for each test to ensure isolation
    freshUsers = generateUsers(200);
    mockRouter.push.mockClear();
    mockRoute.params.id = '1'; // Reset route param

    // Mock global naive-ui utilities
    window.$message = { success: vi.fn(), warning: vi.fn() };
    window.$dialog = { warning: vi.fn() };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('useMajorDetailStore', () => {
    it('refetch should load user data', async () => {
      const detailStore = useMajorDetailStore();
      const { detailData, isLoading, error } = storeToRefs(detailStore);

      await detailStore.refetch();

      expect(isLoading.value).toBe(false);
      expect(error.value).toBe(null);
      expect(detailData.value.userId).toBe('1');
      expect(detailData.value.nickname).toBe('User 1');
    });

    it('refetch should handle user not found', async () => {
      mockRoute.params.id = '9999'; // non-existent user
      const detailStore = useMajorDetailStore();
      const { detailData, error } = storeToRefs(detailStore);

      await detailStore.refetch();

      expect(error.value).toBeInstanceOf(Error);
      expect(error.value?.message).toBe('사용자를 찾을 수 없습니다.');
      expect(detailData.value.userId).toBe(''); // initial state
    });

    it('toggleEditMode should switch edit mode', () => {
      const detailStore = useMajorDetailStore();
      expect(detailStore.editMode).toBe(false);
      detailStore.toggleEditMode();
      expect(detailStore.editMode).toBe(true);
    });

    it('goList should navigate to user list page', () => {
      const detailStore = useMajorDetailStore();
      detailStore.goList();
      expect(mockRouter.push).toHaveBeenCalledWith('/user');
    });
  });

  describe('useMajorFormStore', () => {
    it('setFormModel should populate form with user data', async () => {
      const detailStore = useMajorDetailStore();
      const formStore = useMajorFormStore();

      await detailStore.refetch(); // loads user 1

      expect(formStore.formModel.nickname).toBe('User 1');
      expect(formStore.formModel.email).toBe('user1@example.com');
    });

    it('modifyUser should update user data and exit edit mode', async () => {
      mockRoute.params.id = '2';
      const detailStore = useMajorDetailStore();
      const formStore = useMajorFormStore();
      const { detailData, editMode } = storeToRefs(detailStore);

      await detailStore.refetch(); // Load user 2
      detailStore.toggleEditMode(); // Enter edit mode

      const newNickname = 'Updated User 2';
      formStore.formModel.nickname = newNickname;

      await formStore.modifyUser();

      expect(editMode.value).toBe(false);
      expect(detailData.value.nickname).toBe(newNickname);
      expect(window.$message.success).toHaveBeenCalledWith('수정되었습니다.');

      // Verify the underlying data was changed
      const updatedUser = freshUsers.find(u => u.userId === '2');
      expect(updatedUser?.nickname).toBe(newNickname);
    });

    it('deleteUser should remove user and navigate to list', async () => {
      mockRoute.params.id = '3';
      const detailStore = useMajorDetailStore();
      const formStore = useMajorFormStore();

      await detailStore.refetch(); // Load user 3
      await formStore.deleteUser();

      expect(window.$message.warning).toHaveBeenCalledWith('삭제되었습니다.');
      expect(mockRouter.push).toHaveBeenCalledWith('/user');

      // Verify user is actually deleted from the source array
      const deletedUser = freshUsers.find(u => u.userId === '3');
      expect(deletedUser).toBeUndefined();
    });

    it('checkDeleteUser should open confirmation dialog', () => {
      const detailStore = useMajorDetailStore();
      const formStore = useMajorFormStore();
      // need to have detail data for the dialog message
      detailStore.detailData = { nickname: 'Test User' } as any;

      formStore.checkDeleteUser();
      expect(window.$dialog.warning).toHaveBeenCalled();
    });
  });
});
