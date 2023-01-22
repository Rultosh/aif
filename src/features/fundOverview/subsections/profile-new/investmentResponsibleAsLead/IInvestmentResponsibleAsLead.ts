export interface IInvestmentResponsibleAsLead {
    id: number | undefined,
    teamMemberId: number | undefined,
    nameOfCompany: string | undefined,
    amountInvested: number | undefined,
    dateOfInvestment: string | undefined,
    exitOrWriteOff: string | undefined,
    dateofExitorWriteOff: string | undefined,
    comment: string | undefined
}

export const defaultIIInvestmentResponsibleAsLead = {
  id: undefined,
  teamMemberId: undefined,
  nameOfCompany: undefined,
  amountInvested: undefined,
  dateOfInvestment: undefined,
  exitOrWriteOff: undefined,
  dateofExitorWriteOff: undefined,
  comment: undefined
}