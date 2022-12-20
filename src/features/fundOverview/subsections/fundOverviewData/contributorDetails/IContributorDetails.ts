export interface IContributorDetails {
    id: Number | undefined,
    prelimApplicationId: Number | undefined,
    name: String | undefined,
    amount: String | undefined,
    percentOfCorpus:String | undefined
}

export const defaultContributorDetails : IContributorDetails = {
    id: undefined,
    prelimApplicationId: undefined,
    name: undefined,
    amount: undefined,
    percentOfCorpus: undefined

}  