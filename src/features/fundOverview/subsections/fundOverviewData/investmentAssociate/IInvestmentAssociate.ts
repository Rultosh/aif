export interface IInvestmentAssociate {
    id: Number | undefined,
    prelimApplicationId: Number | undefined,
    name: String | undefined,
    designation: String | undefined,
    age : Number | undefined,
    qualification : String | undefined,
    investmentExperience : Number | undefined,
    description : String | undefined
}

export const defaultInvestmentAssociate : IInvestmentAssociate = {
    id: undefined,
    prelimApplicationId: undefined,
    name: undefined,
    designation: undefined,
    age: undefined,
    qualification: undefined,
    investmentExperience: undefined,
    description: undefined
}  