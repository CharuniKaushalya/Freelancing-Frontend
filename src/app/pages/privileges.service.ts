import { Injectable } from '@angular/core';

@Injectable()
export class privilegeService {


  PRIVILEGE_MENU = {
    Freelancer: [
      {
        type: 'work',
        title: 'Work',
        icon: 'fa fa-bars',
        data: [
          {
            type: 'my_projects',
            title: 'My Projects'
          },
          {
            type: 'my_work',
            title: 'My Bids'
          }
        ]
      },
      {
        type: 'contract',
        title: 'Contract',
        icon: 'fa fa-balance-scale',
        data: [
          {
            type: 'contract_view',
            title: 'My Contract'
          }
        ]
      }
    ],
    Consultant: [
      {
        type: 'work',
        title: 'Work',
        icon: 'fa fa-bars',
        data: [
          {
            type: 'my_projects',
            title: 'My Project'
          },
          {
            type: 'my_work',
            title: 'My Bids'
          }
        ]
      },
      {
        type: 'contract',
        title: 'Contract',
        icon: 'fa fa-balance-scale',
        data: [
          {
            type: 'contract_view',
            title: 'My Contract'
          }
        ]
      }
    ],
    QA: [
      {
        type: 'work',
        title: 'Work',
        icon: 'fa fa-bars',
        data: [
          {
            type: 'my_projects',
            title: 'My Projects'
          },
          {
            type: 'my_work',
            title: 'My Bids'
          }
        ]
      },
      {
        type: 'contract',
        title: 'Contract',
        icon: 'fa fa-balance-scale',
        data: [
          {
            type: 'contract_view',
            title: 'My Contacts'
          }
        ]
      }
    ],
    Client: [
      {
        type: 'admin',
        title: 'Admin',
        icon: 'ion-gear-a',
        data: [
          {
            type: 'skill',
            title: 'Skills'
          },
          {
            type: 'users',
            title: 'Users'
          },
          {
            type: ['users'],
            title: 'Users 2'
          }
        ]
      },
      {
        type: 'work',
        title: 'Work',
        icon: 'fa fa-bars',
        data: [
          {
            type: 'posted_projects',
            title: 'Posted Projects'
          },
          {
            type: 'project_new',
            title: 'Project New'
          }
        ]
      },
      {
        type: 'contract',
        title: 'Contract',
        icon: 'fa fa-balance-scale',
        data: [
          {
            type: 'contract_view',
            title: 'My Contracts'
          },
          {
            type: 'contract_rules',
            title: 'Contract Rules'
          }
        ]
      }
    ]


  };

  getData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.PRIVILEGE_MENU);
      }, 2000);
    });
  }
}

