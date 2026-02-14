export interface IContributorDetails {
    id: Number | undefined,
    prelimApplicationId: Number | undefined,
    name: String | undefined,
    amount: String | undefined,
    percentOfCorpus: String | undefined,
    contributionType: String | undefined,
    categoryOfContributor: String | undefined,
    dateOfCommitment: String | undefined,
    isFirstTimeContributing: String | undefined,
    amountContributedPrev: String | undefined,
    percentOfActualCorpusRaisedPrev: String | undefined
}

export const defaultContributorDetails: IContributorDetails = {
    id: undefined,
    prelimApplicationId: undefined,
    name: undefined,
    amount: undefined,
    percentOfCorpus: undefined,
    contributionType: undefined,
    categoryOfContributor: undefined,
    dateOfCommitment: undefined,
    isFirstTimeContributing: undefined,
    amountContributedPrev: undefined,
    percentOfActualCorpusRaisedPrev: undefined
}  