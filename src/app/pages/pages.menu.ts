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
        path: 'admin',
        data: {
          menu: {
            title: 'general.menu.admin',
            icon: 'ion-gear-a',
            selected: false,
            expanded: false,
            order: 250,
          }
        },
        children: [
          {
            path: 'skill',
            data: {
              menu: {
                title: 'general.menu.skill',
              }
            }
          },
          {
            path: 'users',
            data: {
              menu: {
                title: 'Users',
              }
            }
          }
        ]
      },
      {
        path: 'users',
        data: {
          menu: {
            title: 'general.menu.users',
            icon: 'fa fa-user',
            selected: false,
            expanded: false,
            order: 250,
          }
        },
        children: [
          {
            path: '',
            data: {
              menu: {
                title: 'general.menu.profile',
              }
            }
          }
        ]
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
        path: 'work',
        data: {
          menu: {
            title: 'Work',
            icon: 'fa fa-bars',
            selected: false,
            expanded: false,
            order: 250,
          }
        },
        children: [
          {
            path: 'my_projects',
            data: {
              menu: {
                title: 'general.menu.my_projects',
              }
            }
          },
          {
            path: 'project_new',
            data: {
              menu: {
                title: 'general.menu.project_new',
              }
            }
          },
          {
            path: 'project_details/:1',
            data: {
              menu: {
                title: 'general.menu.project_details',
              }
            }
          },
          {
            path: 'my_work',
            data: {
              menu: {
                title: 'general.menu.my_work',
              }
            }
          },
        ]
      },
      {
        path: '',
        data: {
          menu: {
            title: 'general.menu.pages',
            icon: 'ion-document',
            selected: false,
            expanded: false,
            order: 650,
          }
        },
        children: [
          {
            path: ['/login'],
            data: {
              menu: {
                title: 'general.menu.login'
              }
            }
          },
          {
            path: ['/register'],
            data: {
              menu: {
                title: 'general.menu.register'
              }
            }
          }
        ]
      },
      {
        path: '',
        data: {
          menu: {
            title: 'general.menu.external_link',
            url: 'http://akveo.com',
            icon: 'ion-android-exit',
            order: 800,
            target: '_blank'
          }
        }
      }
    ]
  }
];
