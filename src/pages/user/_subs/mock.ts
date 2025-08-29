import dayjs from 'dayjs';

export interface MockUser {
  userId: string;
  loginId: string;
  nickname: string;
  email: string;
  phoneNumber: string;
  birthday: string;
  signUpType?: string;
  userStatus?: string;
  createdAt: string; // YYYY-MM-DD
}

export function generateUsers(count = 120): MockUser[] {
  const arr: MockUser[] = [];
  for (let i = 1; i <= count; i++) {
    const createdAt = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
    arr.push({
      userId: String(i),
      loginId: `login${i}`,
      nickname: `User ${i}`,
      email: `user${i}@example.com`,
      phoneNumber: `010-${String(1000 + (i % 9000)).padStart(4, '0')}-${String(1000 + (i * 7) % 9000).padStart(4, '0')}`,
      birthday: dayjs().subtract(20 + (i % 20), 'year').format('YYYY-MM-DD'),
      signUpType: i % 2 === 0 ? 'EMAIL' : 'SOCIAL',
      userStatus: i % 5 === 0 ? 'INACTIVE' : 'ACTIVE',
      createdAt,
    });
  }
  return arr;
}

// shared in-memory dataset
let mockUsers: MockUser[] | null = null;
export function getMockUsers(): MockUser[] {
  if (!mockUsers) {
    mockUsers = generateUsers(200);
  }
  return mockUsers;
}

export function filterUsers(
  users: MockUser[],
  params: { nickname?: string; loginId?: string | number; userId?: string | number; createdAfter?: string; createdBefore?: string },
): MockUser[] {
  const { nickname, loginId, userId, createdAfter, createdBefore } = params || {};
  return users.filter((u) => {
    let ok = true;
    if (nickname) ok = ok && u.nickname.toLowerCase().includes(String(nickname).toLowerCase());
    if (loginId) ok = ok && u.loginId.toLowerCase().includes(String(loginId).toLowerCase());
    if (userId) ok = ok && u.userId === String(userId);
    if (createdAfter) ok = ok && u.createdAt >= createdAfter;
    if (createdBefore) ok = ok && u.createdAt <= createdBefore;
    return ok;
  });
}

export function getUserById(users: MockUser[], id: number): MockUser | undefined {
  return users.find(u => Number(u.userId) === id);
}

export function updateUserById(
  users: MockUser[],
  id: number,
  patch: Partial<Pick<MockUser, 'nickname' | 'email' | 'phoneNumber' | 'birthday'>>,
): MockUser | undefined {
  const u = users.find(x => Number(x.userId) === id);
  if (u) {
    Object.assign(u, patch);
  }
  return u;
}

export function deleteUserById(users: MockUser[], id: number): boolean {
  const idx = users.findIndex(x => Number(x.userId) === id);
  if (idx >= 0) {
    users.splice(idx, 1);
    return true;
  }
  return false;
}
