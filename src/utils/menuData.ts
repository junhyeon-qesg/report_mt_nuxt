interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

const menuData: MenuItem[] = [
  {
    label: '대시보드',
    icon: 'ion:home-outline',
    route: '/',
  },
  {
    label: '지표 가이드 관리',
    icon: 'ion:book-outline',
    route: '/code-guide',
  },
  {
    label: '데이터 시트 관리',
    icon: 'ion:grid-outline',
    route: '/data-sheet',
  },
  {
    label: 'Sample Page',
    icon: 'ion:document-outline',
    route: '/sample',
  },
];

export default menuData;
