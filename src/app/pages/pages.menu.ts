
export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'dashboard',
        data: {
          menu: {
            title: 'Dashboard',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'users',
        data: {
          menu: {
            title: 'Profile',
            icon: 'fa fa-user',
            selected: false,
            expanded: false,
            order: 250,
            hidden: true,
          }
        },
        children: [
          {
            path: 'profile',
            data: {
              menu: {
                title: 'MY Profile',
                pathMatch: 'prefix',
                hidden: true,
              }
            }
          },
          {
            path: 'wallet',
            data: {
              menu: {
                title: 'My Wallet',
                pathMatch: 'prefix',
                hidden: true,
              }
            }
          },
        ]
      },
    ]
  }
];
