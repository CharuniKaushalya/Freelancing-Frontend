import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RatingModule, Rating } from "ng2-rating";

import { AuthService } from '../../../../providers/auth.service';

import { MyService } from "../../../../theme/services/backend/service";

import { Review } from "../../../../theme/models/review";
import { Contract } from "../../../../theme/models/contract";

@Component({
    selector: 'app-review-model',
    templateUrl: './review-model.component.html',
    styleUrls: ['./review-model.component.scss'],
    providers: [MyService, AuthService, Rating]
})
export class ReviewModelComponent implements OnInit {

    key: string;
    public form: FormGroup;
    public rate: AbstractControl;
    public description: AbstractControl;

    skillsStream = "user-skill";
    skills = [];
    skill_rates = {};
    public contract: Contract;

    public submitted: boolean = false;

    @Input() review: Review;
    reviewStream: string = "user-reviews"; isDisabled: boolean = false;

    advanceReview = true;

    constructor(private activeModal: NgbActiveModal, fb: FormBuilder, public authService: AuthService,
        private _service: MyService, private _router: Router) {
        this.review = new Review();

        this.form = fb.group({
            'rate': ['', Validators.compose([Validators.required])],
            'description': ['', Validators.compose([Validators.required])]
        });

        this.rate = this.form.controls['rate'];
        this.description = this.form.controls['description'];

    }

    ngOnInit() {
        this._service.gettxoutdata(this.key).then(data => {
            this.contract = JSON.parse(this._service.Hex2String(data.toString()));

            if (this.contract.client_email == localStorage.getItem("email")) {
                this.review.from = this.contract.client_email;
                this.review.to = this.contract.freelancer_email;
                this.loadSkills(this.contract.freelancer_email);
            } else if (this.contract.freelancer_email == localStorage.getItem("email")) {
                this.review.from = this.contract.freelancer_email;
                this.review.to = this.contract.client_email;
            }
        }).catch(error => {
            console.log(error.message);
        });
    }

    closeModal() {
        this.activeModal.close();
    }

    showAdvancedReview(): void {
        this.advanceReview = false;
        $('#divAdvance').show();
    }

    hideAdvancedReview(): void {
        this.advanceReview = true;
        $('#divAdvance').hide();
    }

    rateChange(skill: string, rate:number): void {
        this.skill_rates[skill] = rate;
    }

    loadSkills(userkey: string) {
        this._service.listStreamKeyItems(this.skillsStream, userkey).then(data => {
            console.log(data);
            let skill = JSON.parse(this._service.Hex2String(data[data.length - 1].data.toString()));
            skill.forEach(element => {
                console.log(element);
                this.skills.push(element);
                this.skill_rates[element] = 0;
            });
        });
    }

    public onSubmit(values: Object): void {
        this.submitted = true;
        let review_key = this.key + "/" + this.review.from;

        if (this.form.valid) {

            this._service.sign(localStorage.getItem("address"), JSON.stringify(this.review)).then(data => {
                if (data.sign) {
                    this.review.signature = data.sign;
                }
                if(!this.advanceReview) {
                    this.review.skills = JSON.stringify(this.skill_rates);
                }
                console.log(this.review);
                let rJSON = JSON.stringify(this.review);
                let data_hex = this._service.String2Hex(rJSON);
                this._service.publishToStream(this.reviewStream, review_key, data_hex).then(data => {
                    this.activeModal.close();
                }).catch(error => {
                    console.log(error.message);
                });
            }).catch(error => {
                console.log(error.message);
            });
        }
    }
}
