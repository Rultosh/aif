export interface IInvestmentPast {
    id: Number | undefined,
    prelimApplicationId: Number | undefined,
    nameOfCompany: String | undefined,
    sector: String | undefined,
    briefProfile: String | undefined,
    dateOfInvestment: Date | undefined,
    amountInvested: Number | undefined,
    currentStatus: String | undefined,
    instrumentType: String | undefined,
    shareholdingInvestee: String | undefined,
    moic: String | undefined,
    grossIrr: String | undefined,
    conflictOfInterest: String | undefined,
    stakeOfEmployee: String | undefined,
    investmentStageFundingRound: String | undefined
}

export const defaultInvestmentPast: IInvestmentPast = {
    id: undefined,
    prelimApplicationId: undefined,
    nameOfCompany: undefined,
    sector: undefined,
    briefProfile: undefined,
    dateOfInvestment: undefined,
    amountInvested: undefined,
    currentStatus: undefined,
    instrumentType: undefined,
    shareholdingInvestee: undefined,
    moic: undefined,
    grossIrr: undefined,
    conflictOfInterest: undefined,
    stakeOfEmployee: undefined,
    investmentStageFundingRound: undefined
}