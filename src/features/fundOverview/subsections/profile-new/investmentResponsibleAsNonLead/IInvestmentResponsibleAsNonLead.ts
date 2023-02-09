export interface IInvestmentResponsibleAsNonLead {
    id: number | undefined,
    teamMemberId: number | undefined,
    nameOfCompany: string | undefined,
    amountInvested: number | undefined,
    dateOfInvestment: string | undefined,
    exitOrWriteOff: string | undefined,
    dateofExitorWriteOff: string | undefined,
    irrPercent: string | undefined,
    comment: string | undefined
}

export const defaultIIInvestmentResponsibleAsNonLead = {
  id: undefined,
  teamMemberId: undefined,
  nameOfCompany: undefined,
  amountInvested: undefined,
  dateOfInvestment: undefined,
  exitOrWriteOff: undefined,
  dateofExitorWriteOff: undefined,
  irrPercent: undefined,
  comment: undefined
}