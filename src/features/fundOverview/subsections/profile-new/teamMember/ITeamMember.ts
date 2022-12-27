export interface ITeamMember {
  id: number | undefined,
  prelimApplicationId: number | undefined,
  name: string | undefined,
  dob: string | undefined,
  dateofJoiningAMC: string | undefined,
  location: string | undefined,
  yearsOfRelevantExp: string | undefined,
  keyPerson: string | undefined,
  directorship: string | undefined
}

export const defaultTeamMember = {
  id: undefined,
  prelimApplicationId: undefined,
  name: undefined,
  dob: undefined,
  dateofJoiningAMC: undefined,
  location: undefined,
  yearsOfRelevantExp: undefined,
  keyPerson: undefined,
  directorship: undefined
}

// export interface IInvestmentResponsbileAsLead {
//     nameOfCompany: string | undefined,
//     amountInvested: number | undefined,
//     dateOfInvestment: string | undefined,
//     exitOrWriteOff: number | undefined,
//     dateofExitorWriteOff: string | undefined,
//     comment: string | undefined
// }