export interface IInvestmentResponsibleAsLead {
    id: number | undefined,
    teamMemberId: number | undefined,
    nameOfCompany: string | undefined,
    amountInvested: number | undefined,
    dateOfInvestment: string | undefined,
    exitOrWriteOff: string | undefined,
    dateofExitorWriteOff: string | undefined,
    comment: string | undefined,
    irrPercent: string | undefined,
    howWasTheDealSourced: string | undefined,
    addressOfCompany: string | undefined,
    moic: string | undefined
}

export const defaultIIInvestmentResponsibleAsLead = {
  id: undefined,
  teamMemberId: undefined,
  nameOfCompany: undefined,
  amountInvested: undefined,
  dateOfInvestment: undefined,
  exitOrWriteOff: undefined,
  dateofExitorWriteOff: undefined,
  comment: undefined,
  howWasTheDealSourced: undefined,
  addressOfCompany: undefined,
  irrPercent: undefined,
  moic: undefined
}