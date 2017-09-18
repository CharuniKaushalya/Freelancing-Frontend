import {Injectable} from '@angular/core';

@Injectable()
export class privilegeService {
  

  PRIVILEGE_MENU = {
  Freelancer:[
    {
      type: 'work',
      title: 'Work',
      icon: 'fa fa-bars',
      data: [
        {
          type: 'my_projects',
          title: 'general.menu.my_projects'
        },
        {
          type: 'my_work',
          title: 'general.menu.my_work'
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
          title: 'general.menu.contract_view'
        }
      ]
    }
  ],
  Consultant:[
    {
      type: 'work',
      title: 'Work',
      icon: 'fa fa-bars',
      data: [
        {
          type: 'my_projects',
          title: 'general.menu.my_projects'
        },
        {
          type: 'my_work',
          title: 'general.menu.my_work'
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
          title: 'general.menu.contract_view'
        }
      ]
    }
  ],
  QA:[
    {
      type: 'work',
      title: 'Work',
      icon: 'fa fa-bars',
      data: [
        {
          type: 'my_projects',
          title: 'general.menu.my_projects'
        },
        {
          type: 'my_work',
          title: 'general.menu.my_work'
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
          title: 'general.menu.contract_view'
        }
      ]
    }
  ],
  Client:[
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
          type: 'my_projects',
          title: 'general.menu.my_projects'
        },
        {
          type: 'posted_projects',
          title: 'Posted Projects'
        },
        {
          type: 'project_new',
          title: 'general.menu.project_new'
        },
        {
          type: 'my_work',
          title: 'general.menu.my_work'
        }
      ]
    },
    {
      type: 'contract',
      title: 'Contract',
      icon: 'fa fa-balance-scale',
      data: [
        {
          type: 'mycontract',
          title: 'general.menu.mycontract'
        },
        {
          type: 'contract_view',
          title: 'general.menu.contract_view'
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
