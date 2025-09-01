import { defineStore } from 'pinia';

export interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'pending';
  selected?: boolean; // Add selected property
}

export interface Permission {
  id: string;
  name: string;
  // Future properties as per requirements
  // canEditTemplate: boolean;
  // canEditPermission: boolean;
  // canCreateSheet: boolean;
}

export interface PermissionAssignment {
  [permissionId: string]: number[]; // permissionId maps to an array of userIds
}

interface AccessControlState {
  users: User[];
  permissions: Permission[];
  assignments: PermissionAssignment;
}

export const useAccessControlStore = defineStore('access-control', {
  state: (): AccessControlState => ({
    users: [
      { id: 1, name: '김철수', email: 'chulsoo.kim@example.com', status: 'active' },
      { id: 2, name: '이영희', email: 'younghee.lee@example.com', status: 'active' },
      { id: 3, name: '박지성', email: 'jisung.park@example.com', status: 'pending' },
      { id: 4, name: '안정환', email: 'junghwan.ahn@example.com', status: 'active' },
      { id: 5, name: '손흥민', email: 'heungmin.son@example.com', status: 'active' },
    ],
    permissions: [
      { id: 'admin', name: '관리자' },
      { id: 'editor', name: '편집자' },
      { id: 'viewer', name: '뷰어' },
      { id: 'auditor', name: '감사자' },
      { id: 'reporter', name: '보고자' },
      { id: 'guest', name: '게스트' },
    ],
    assignments: {
      admin: [1],
      editor: [2, 4],
      viewer: [],
    },
  }),

  getters: {
    unassignedUsers(state): User[] {
      const assignedUserIds = Object.values(state.assignments).flat();
      return state.users.filter(user => !assignedUserIds.includes(user.id));
    },
    getUsersByPermission: state => (permissionId: string): User[] => {
      const userIds = state.assignments[permissionId] || [];
      return userIds.map(id => state.users.find(u => u.id === id)).filter(Boolean) as User[];
    },
  },

  actions: {
    inviteUser(email: string) {
      const newUser: User = {
        id: Math.max(...this.users.map(u => u.id)) + 1,
        name: email.split('@')[0], // Simple name generation
        email,
        status: 'pending',
      };
      this.users.push(newUser);
    },
    addPermission(name: string) {
      const newPermission: Permission = {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
      };
      this.permissions.push(newPermission);
      // Initialize assignment array for the new permission
      this.assignments[newPermission.id] = [];
    },
    assignUserToPermission(userId: number, permissionId: string) {
      // Remove from any other permission group first
      this.removeUserFromAllPermissions(userId);

      // Add to the new permission group
      if (!this.assignments[permissionId]) {
        this.assignments[permissionId] = [];
      }
      this.assignments[permissionId].push(userId);
    },
    removeUserFromAllPermissions(userId: number) {
      for (const permId in this.assignments) {
        const index = this.assignments[permId].indexOf(userId);
        if (index > -1) {
          this.assignments[permId].splice(index, 1);
        }
      }
    },
    updateAssignments(permissionId: string, users: User[]) {
      const userIds = users.map(u => u.id);
      this.assignments[permissionId] = userIds;
    },
  },
});
