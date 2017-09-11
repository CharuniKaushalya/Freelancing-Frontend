
export const PAGES_MENU = [
  {
    path: 'pages',
    children: [
      {
        path: 'dashboard',
        data: {
          menu: {
            title: 'general.menu.dashboard',
            icon: 'ion-android-home',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: 'contract',
        data: {
          menu: {
            title: 'Contract',
            icon: 'fa fa-balance-scale',
            selected: false,
            expanded: false,
            order: 250,
          }
        },
        children: [
          {
            path: 'mycontract',
            data: {
              menu: {
                title: 'general.menu.mycontract',
              }
            }
          },
          {
            path: 'contract_view',
            data: {
              menu: {
                title: 'general.menu.contract_view',
              }
            }
          }
        ]
      },
      {
        path: 'discussion',
        data: {
          menu: {
            title: 'Discussion',
            icon: 'ion-ios-compose-outline',
            selected: false,
            expanded: false,
            order: 250,
          }
        },
        children: [
          
          {
            path: 'discussion_view',
            data: {
              menu: {
                title: 'View'
              }
            }
          }
        ]
      },
    ]
  }
];
