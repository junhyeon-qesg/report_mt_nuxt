interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
}

const menuData: MenuItem[] = [
  {
    label: '대시보드 - 관리자',
    icon: 'ion:home-outline',
    route: '/admin-dashboard',
  },
  {
    label: '대시보드 - 사용자',
    icon: 'ion:home-outline',
    route: '/user-dashboard',
  },
  {
    label: '지표 템플릿 관리',
    icon: 'ion:document-text',
    route: '/code-template',
  },
  {
    label: '데이터 시트',
    icon: 'ion:document-attach',
    route: '/data-sheet',
  },
  {
    label: '데이터 시트 관리',
    icon: 'ion:grid-outline',
    route: '/data-sheet-manage',
  },
  {
    label: '데이터 관리',
    icon: 'ion:folder-open-outline',
    route: '/data-manage',
  },
  {
    label: '히스토리',
    icon: 'ion:time',
    route: '/history',
  },
  {
    label: 'Test',
    icon: 'ion:code',
    children: [
      {
        label: '지표 - Handsontable',
        icon: 'ion:book-outline',
        route: '/code-guide1',
      },
      {
        label: '지표 - SpreadJS',
        icon: 'ion:book-outline',
        route: '/code-guide2',
      },
      {
        label: '지표 - JspreadSheet',
        icon: 'ion:book-outline',
        route: '/code-guide3',
      },
      {
        label: '사용자 - CRUD 샘플',
        icon: 'ion:people-outline',
        route: '/user',
      },
    ],
  },
];

export default menuData;
