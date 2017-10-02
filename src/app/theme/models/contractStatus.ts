/**
 * Contract
 */
export class ContractStatus {
    public status: string; /* Pending, Active, Completed */
    public contract_id: string;
    public current_milestone: number;
    public milestone_state: string; /* Valid States => Uncompleted, Working, Reviewing, Completed */
}
