export interface IInvestmentPartner {
    id: Number | undefined,
    prelimApplicationId: Number | undefined,
    name: String | undefined,
    designation: String | undefined,
    age : String | undefined,
    qualification : String | undefined,
    vcpeExperience : String | undefined,
    description : String | undefined
}

export const defaultInvestmentPartner : IInvestmentPartner = {
    id: undefined,
    prelimApplicationId: undefined,
    name: undefined,
    designation: undefined,
    age: undefined,
    qualification: undefined,
    vcpeExperience: undefined,
    description: undefined
}  