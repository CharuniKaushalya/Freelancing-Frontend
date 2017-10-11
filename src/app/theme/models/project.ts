/**
 * Project
 */
import {TimePeriod} from "./timeperiod";
import {Budget} from "./budget";
import {DownloadFile} from "./downloadFile";
// import {Skill} from "./skill";

export class Project {
    public project_id : string;
	public client: string;
    public projectName: string;
    public description :string;
	public files :DownloadFile[] ;
    public skills: any;
	public time_period: TimePeriod;
    public budget: Budget;
    public qabudget: Budget;    
    public user: string;
}