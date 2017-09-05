/**
 * Contract
 */
export class ContractStatus {
    public contract_id: string;
    public current_milestone: number;
    public milestone_state: string; /* Valid States => W(Working), R(Reviewing), P(Paid) C(Completed) */
}