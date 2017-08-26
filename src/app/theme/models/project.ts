/**
 * Project
 */
import {TimePeriod} from "./timeperiod";
import {Budget} from "./budget";
// import {Skill} from "./skill";

export class Project {
    public project_id : string;
	public client: string;
    public projectName: string;
    public description :string;
	public files :string[] ;
    public skills: any;
	public time_period: TimePeriod;
    public budget: Budget;
}