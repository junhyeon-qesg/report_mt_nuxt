interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

const menuData: MenuItem[] = [
  {
    label: '대시보드',
    icon: 'ion:home-outline',
    route: '/dashboard',
  },
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
    label: '데이터 시트 관리',
    icon: 'ion:grid-outline',
    route: '/data-sheet',
  },
  {
    label: '사용자 - CRUD 샘플',
    icon: 'ion:people-outline',
    route: '/user',
  },
];

export default menuData;
