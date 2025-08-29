import { ref } from 'vue';
import type { FormInst, FormItemRule, DataTableColumns, DataTableRowKey, PaginationProps } from 'naive-ui';
import dayjs from 'dayjs';
// GraphQL 제거: 로컬 더미 데이터 사용
import { getMockUsers, filterUsers } from './mock';
import { defineManualStore } from '~/plugins/storeManager';

interface MajorForm {
  searchValue?: string;
  searchType: 'nickname' | 'username' | 'userId';
  createdAt: [number, number] | null;
}

export interface UserRowData {
  birthday?: string;
  email?: string;
  isDeleted?: boolean;
  loginId: string;
  nickname?: string;
  phoneNumber?: string;
  profileImageId?: string;
  userId?: string;
  userProfileImg?: string;
  signUpType?: string;
  userStatus?: string;
}

type OmitPageGetUserListQueryVariables = {
  nickname?: string;
  loginId?: string | number;
  userId?: string | number;
  createdAfter?: string;
  createdBefore?: string;
};

const inputOptions = [
  {
    label: '닉네임',
    value: 'nickname',
  },
  {
    label: '로그인 ID',
    value: 'loginId',
  },
  {
    label: '회원번호',
    value: 'userId',
  },
];

export default function main() {
  const majorForm = useMajorFormStore();
  const majorList = useMajorListStore();

  return {
    majorForm,
    majorList,
  };
}

export const useMajorFormStore = defineManualStore(defMajorFormStore, 'userMajorForm');
export const useMajorListStore = defineManualStore(defMajorListStore, 'userMajorList');

function defMajorFormStore() {
  const formRef = ref<FormInst | null>(null);
  const formModel = ref<MajorForm>({
    searchType: 'nickname',
    searchValue: '',
    createdAt: null,
  });
  const rules = ref<Record<string, FormItemRule>>({});
  const majorList = useMajorListStore();

  function onSubmit(e: Event) {
    e.preventDefault();

    formRef.value?.validate((errors) => {
      if (errors) {
        // validation errors
        return;
      }

      majorList.updateSearchParams(formModel.value);
      majorList.refetch();
    });
  }
  function onReset() {
    formModel.value = {
      searchType: 'nickname',
      searchValue: '',
      createdAt: null,
    };
    majorList.updateSearchParams(formModel.value);
    majorList.refetch();
  }

  return {
    formRef,
    formModel,
    rules,
    inputOptions,
    onSubmit,
    onReset,
  };
}

function defMajorListStore() {
  const router = useRouter();
  // 더미 데이터 풀(공유 인메모리)
  const allUsers = ref(getMockUsers());
  const dataList = ref<UserRowData[]>([]);
  const checkedRowKeysRef = ref<DataTableRowKey[]>([]);

  const dataColumns: DataTableColumns<UserRowData> = [
    {
      type: 'selection',
    },
    {
      key: 'userId',
      title: '회원번호',
      width: 100,
      align: 'center',
    },
    {
      key: 'nickname',
      title: '닉네임',
      render(row) {
        return h('a', {
          style: {
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'underline',
            cursor: 'pointer',
          },
          onClick: () => {
            router.push(`/user/${row.userId}`);
          },
        }, [row.nickname]);
      },
      width: '30%',
    },
    {
      key: 'loginId',
      title: '로그인 ID',
      width: '30%',
    },

    {
      key: 'email',
      title: '이메일',
      width: '30%',
    },
    {
      key: 'phoneNumber',
      title: '전화번호',
      width: 150,
      align: 'center',
    },
    {
      key: 'birthday',
      title: '생년월일',
      width: 150,
      align: 'center',
    },
  ];

  const searchParams = ref<OmitPageGetUserListQueryVariables>({
    nickname: '',
    createdAfter: '',
    createdBefore: '',
  });

  const pagination = reactive<PaginationProps>({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    onUpdatePage(page) {
      pagination.page = page;
      refetch();
    },
  });

  // 수동 로딩/에러/페치
  const isLoading = ref(false);
  const error = ref<Error | null>(null);
  async function refetch() {
    try {
      isLoading.value = true;
      error.value = null;
      // 네트워크 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 200));

      const filtered = filterUsers(allUsers.value, searchParams.value);
      pagination.itemCount = filtered.length;

      const pageNum = Number(pagination.page || 1);
      const pageSize = Number(pagination.pageSize || 10);
      const start = (pageNum - 1) * pageSize;
      const pageData = filtered.slice(start, start + pageSize);

      dataList.value = pageData.map(e => ({
        email: e.email,
        birthday: e.birthday,
        loginId: e.loginId,
        nickname: e.nickname,
        phoneNumber: e.phoneNumber,
        userId: e.userId,
        signUpType: e.signUpType,
        userStatus: e.userStatus,
      }));
    }
    catch (e) {
      error.value = e as Error;
    }
    finally {
      isLoading.value = false;
    }
  }

  function updateSearchParams(form: MajorForm) {
    const createdDates = form.createdAt
      ? {
          createdAfter: dayjs(form.createdAt[0]).format('YYYY-MM-DD'),
          createdBefore: dayjs(form.createdAt[1]).format('YYYY-MM-DD'),
        }
      : {
          createdAfter: '',
          createdBefore: '',
        };

    searchParams.value = {
      ...createdDates,
      [form.searchType]: form.searchValue || '',
    };
    pagination.page = 1;
  }

  function handleCheck(keys: DataTableRowKey[]) {
    checkedRowKeysRef.value = keys;
  }

  return {
    dataList,
    isLoading,
    error,
    pagination,
    dataColumns,
    checkedRowKeysRef,
    refetch,
    updateSearchParams,
    handleCheck,
  };
}
