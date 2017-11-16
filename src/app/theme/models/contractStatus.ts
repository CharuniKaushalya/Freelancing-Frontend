/**
 * Contract
 */
export class ContractStatus {
    public contract_id: string;
    public status: string; /* Pending, Confirmed, Active, Completed, Cancelled */
    public current_milestone: number;
    public milestone_state: string; /* Valid States => Uncompleted, Working, Reviewing, Completed */
    public contract_link: any;
    public redo: number;
}
