// tanstack/vue-query, apollo 제거
import dayjs from 'dayjs';
import type { FormInst, FormItemRule } from 'naive-ui';
import { defineLocalStore } from '~/plugins/storeManager';
import type { MockUser } from '../../_subs/mock';
import { getMockUsers, getUserById, updateUserById, deleteUserById } from '../../_subs/mock';
// 로컬 Maybe 타입
type Maybe<T> = T | null | undefined;

interface MajorForm {
  nickname?: Maybe<string>;
  email?: Maybe<string>;
  phoneNumber?: Maybe<string>;
  birthday?: Maybe<string>;
}

export default function main() {
  const majorDetail = useMajorDetailStore();
  const majorForm = useMajorFormStore();

  return {
    majorDetail,
    majorForm,
  };
}

export const useMajorDetailStore = defineLocalStore(defMajorDetailStore);
export const useMajorFormStore = defineLocalStore(defMajorFormStore);

function defMajorDetailStore() {
  const router = useRouter();
  const route = useRoute();
  // apollo 제거
  const majorForm = useMajorFormStore();

  const editMode = ref(false);
  const detailData = ref<MockUser>({
    userId: '',
    loginId: '',
    nickname: '',
    email: '',
    phoneNumber: '',
    birthday: '',
    createdAt: '',
  });
  const dataUpdated = ref(false);

  const userId = computed(() => Number(route.params.id));

  const getDateFormat = (date?: string | null) => {
    if (!date) return '';
    return dayjs(date).format('YYYY-MM-DD'); ;
  };

  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  onMounted(() => {
    refetch();
  });

  async function refetch() {
    try {
      isLoading.value = true;
      error.value = null;
      await new Promise(r => setTimeout(r, 120));
      const users = getMockUsers();
      const u = getUserById(users, userId.value);
      console.log(u);

      dataUpdated.value = false;
      if (u) {
        detailData.value = u;
        majorForm.setFormModel(u);
      }
      else {
        throw new Error('사용자를 찾을 수 없습니다.');
      }
    }
    catch (e) {
      error.value = e as Error;
    }
    finally {
      isLoading.value = false;
    }
  }

  function goList() {
    router.push('/user');
  }

  function setDetailData(data: MockUser) {
    detailData.value = data;
  }
  function toggleEditMode() {
    editMode.value = !editMode.value;
  }

  return {
    detailData,
    isLoading,
    error,
    editMode,
    dataUpdated,
    getDateFormat,
    refetch,
    goList,
    toggleEditMode,
    setDetailData,
  };
}

function defMajorFormStore() {
  const majorDetail = useMajorDetailStore();

  const formRef = ref<FormInst | null>(null);
  const formModel = ref<MajorForm>({
    nickname: '',
    email: '',
    phoneNumber: '',
    birthday: '',
  });
  const rules = ref<Record<string, FormItemRule>>({
    nickname: {
      required: true,
      message: '닉네임을 입력해주세요.',
    },
    email: {
      message: '',
      trigger: ['input'],
      validator: (rule: FormItemRule, value: string) => {
        if (value == null || value === '') {
          return true;
        }
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
      },
    },
    phoneNumber: {
      message: '올바른 휴대폰 번호를 입력해주세요.',
      trigger: ['input'],
      validator: (rule: FormItemRule, value: string) => {
        if (value == null || value === '') {
          return true;
        }
        return /^01([0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})$/.test(value);
      },
    },
  });
  const formItemClass = {
    labelClass: 'detail-form-label',
    feedbackClass: 'detail-form-feedback',
  };

  const modifyUserLoading = ref(false);
  const modifyUserError = ref<Error | null>(null);
  async function modifyUser() {
    try {
      modifyUserLoading.value = true;
      modifyUserError.value = null;
      await new Promise(r => setTimeout(r, 120));
      const users = getMockUsers();
      const updated = updateUserById(users, Number(majorDetail.detailData.userId), {
        nickname: formModel.value.nickname ?? undefined,
        email: formModel.value.email ?? undefined,
        phoneNumber: formModel.value.phoneNumber ?? undefined,
        birthday: formModel.value.birthday ?? undefined,
      });
      if (!updated) {
        throw new Error('수정 실패');
      }
      majorDetail.setDetailData(updated);
      majorDetail.toggleEditMode();
      window.$message.success('수정되었습니다.');
    }
    catch (e) {
      modifyUserError.value = e as Error;
    }
    finally {
      modifyUserLoading.value = false;
    }
  }
  const deleteUserLoading = ref(false);
  const deleteUserError = ref<Error | null>(null);
  async function deleteUser() {
    try {
      deleteUserLoading.value = true;
      deleteUserError.value = null;
      await new Promise(r => setTimeout(r, 120));
      const ok = deleteUserById(getMockUsers(), Number(majorDetail.detailData.userId));
      if (!ok) {
        throw new Error('삭제 실패');
      }
      window.$message.warning('삭제되었습니다.');
      majorDetail.goList();
    }
    catch (e) {
      deleteUserError.value = e as Error;
    }
    finally {
      deleteUserLoading.value = false;
    }
  }

  function onSubmit(e: Event) {
    e.preventDefault();

    formRef.value?.validate((errors) => {
      if (errors) return;
      modifyUser();
    });
  }

  function setFormModel(data: MockUser) {
    formModel.value = {
      nickname: data.nickname,
      email: data.email,
      phoneNumber: data.phoneNumber,
      birthday: data.birthday,
    };
  }
  function checkDeleteUser() {
    window.$dialog.warning({
      title: '회원 삭제',
      content: `'${majorDetail.detailData.nickname}'님을 정말로 삭제하시겠습니까?`,
      positiveText: '삭제',
      negativeText: '취소',
      onPositiveClick: () => {
        deleteUser();
      },
    });
  }

  return {
    formRef,
    formModel,
    rules,
    formItemClass,
    modifyUserError,
    modifyUserLoading,
    modifyUser,
    onSubmit,
    setFormModel,
    checkDeleteUser,
    deleteUserLoading,
    deleteUserError,
  };
}
