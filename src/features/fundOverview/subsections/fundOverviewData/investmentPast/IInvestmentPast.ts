export interface IInvestmentPast {
    id: Number | undefined,
    prelimApplicationId: Number | undefined,
    nameOfCompany: String | undefined,
    sector: String | undefined,
    amountInvested : Number | undefined,
    dateOfInvestment : String | undefined,
    briefProfile: String | undefined
}

export const defaultInvestmentPast : IInvestmentPast = {
    id: undefined,
    prelimApplicationId: undefined,
    nameOfCompany: undefined,
    sector: undefined,
    amountInvested: undefined,
    dateOfInvestment: undefined,
    briefProfile: undefined
}  