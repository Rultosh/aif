export interface ICompanyContactDetails {
    id: number | undefined,
    teamMemberId: number | undefined,
    nameOfCompany: string | undefined,
    nameOfPromoter: string | undefined,
    address: string | undefined,
    telephoneNo: string | undefined,
    mobileNo: string | undefined,
    email: string | undefined,
    alternateEmail: string | undefined,
    yearOfInvestment: string | undefined,
}

export const defaultIICompanyContactDetails = {
  id: undefined,
  teamMemberId: undefined,
  nameOfCompany: undefined,
  nameOfPromoter: undefined,
  address: undefined,
  telephoneNo: undefined,
  mobileNo: undefined,
  email: undefined,
  alternateEmail: undefined,
  yearOfInvestment: undefined,
}