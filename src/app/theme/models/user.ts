/**
 * User
 */

 import {FormGroup, AbstractControl, FormBuilder, Validators} from '@angular/forms';

export class User {
	public user_id : string;
    public username : string;
	public name: string;
    public email: string;
    public password :string;
	public usertype: number;
    
}