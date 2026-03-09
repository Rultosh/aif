export const questionsForMoreThanOne = {
    "selfRatingQuestions": [
      {
        "id": 1,
        "text":"Sponsor's Commitment to the proposed Fund" ,
        "options":[">=10% of corpus", ">=5% but less than 10% of corpus", ">=2.50% but less than 5% corpus", "Lower of 2.50% or Rs.5 Cr of corpus as per SEBI Regulations"],
        "size":6,
        "contribution": 0.2,
        'weightage':[1,0.75,0.5,0.25]
    },
    {
        "id": 2,
        "text":"Age Profile of Key Members (Partners/Directors)" ,
        "options":["Average age is less than 45 years", "Average age is between 45 and 55 years", "Average age is between 55 and 60 years", "Average age is more than 60 years"],
        "size":6,
        "contribution": 0.0333,
        'weightage':[1,0.75,0.5,0.25]
    },
    {
        "id": 3,
        "text":"Average Investment Experience of Partners/Directors of Fund Manager" ,
        "options":["More than 20 years", "More than 15 years but upto 20 years", "More than 10 years but upto 15 years", "Upto 10 years"],
        "size":6,
        "contribution": 0.0333,
        'weightage':[1,0.75,0.5,0.25]
    },
    {
        "id": 4,
        "text":"Average Investment experience of investment team members (other than Partners/Directors) of Fund Manager" ,
        "options":["More than 10 years", "More than 5 years but upto 10 years", "More than 3 years but upto 5 years", "Upto 3 years"],
        "size":6,
        "contribution": 0.0333,
        'weightage':[1,0.75,0.5,0.25]
    },
    {
        "id": 5,
        "text":"Share of employees (other than the Partners/Directors) in Carry" ,
        "options":[ ">=40%", ">=30% & <40%", ">=20% & <30%", "<20%"],
        "size":3,
        "contribution": 0.0333,
        'weightage':[1,0.6,0.3]
    },
    {
        "id": 6,
        "text":"Working relation among Directors/Partners of AMC" ,
        "options":["Working together for more than 10 years though some new may have joined", "Majority working together for more than 5 years,though few members have left", "Working together for more than 2 years but upto 5 years or major split in AMC structure","Coming together for the first time whose cohesiveness is to be tested"],
        "size":12,
        "contribution": 0.0333,
        'weightage':[1,0.75,0.5,0.25]
    },
    {
        "id": 7,
        "text":"Level of commitments raised excluding sponsor" ,
        "options":["Confirmed commitments of more than 40% of targeted corpus already raised", "Confirmed commitments of more than 25% of targeted corpus already raised", "Confirmed commitments of more than 15% of targeted corpus already raised", "Confirmed commitments less than 15% of targeted corpus already raised/No confirmed commitments raised so far"],
        "size":12,
        "contribution": 0.0333,
        'weightage':[1,0.75,0.5,0.25]
    },
    {
        "id": 8,
        "text":"LP Advisory Committee/Advisory Board" ,
        "options":[
                "The Fund have an Advisory Board/LP Advisory Committee with representation from major investors with 50% of total Corpus",
                "The Fund have a Advisory Board/LP Advisory Committee with representation from a few investors.",
                "The Fund do not propose to have such Board/Committee"
            ],
        "size":12,
        "contribution": 0.125,
        'weightage':[1,0.5,0]
    },
    {
        "id": 9,
        "text":"Profile of Auditors engaged/proposed to be engaged by the Fund" ,
        "options":[
            "Big 5 Auditors/propose to engage one of Big 5 auditors",
            "Not from Big 5 list, but reputed auditors with atleast 20 partners",
            "Other than above"
        ],
        "size":6,
        "contribution": 0.125,
        'weightage':[1,0.5,0]
    },
    {
        "id": 10,
        "text":"Level of commitments raised excluding sponsor" ,
        "options":[
            "Confirmed commitments of more than 40% of targeted corpus already raised", 
            "Confirmed commitments of more than 25% of targeted corpus already raised", 
            " Confirmed commitments of more than 15% of targeted corpus already raised", 
            "Confirmed commitments of less than 15% of targeted corpus already raised/No confirmed commitments raised so far"
        ],
        "size":12,
        "contribution": 0.0438,
        'weightage':[1,0.75,0.5,0.25]
    },
    {
        "id": 11,
        "text":"Exit status of investments from last Fund (by % value)" ,
        "options":[
            ">75%",
            ">50% & <=75%",
            ">25% & <=50%",
            "<25%"
        ],
        "size":3,
        "contribution": 0.0438,
        'weightage':[1,0.75,0.5,0.25]
    },
    {
        "id": 12,
        "text":"First Closing in % of target corpus in last Fund" ,
        "options":[
            ">30%",
            ">20% & <=30%",
            ">10% & <=20%",
            "<10%"
        ],
        "size":3,
        "contribution": 0.0438,
        'weightage':[1,0.75,0.5,0.25]
    },
    {
        "id": 13,
        "text":"Extension of Commitment period in the last Fund" ,
        "options":[
            "No Extension",
            "12 Months",
            "24 Months",
            "More than 24 Months"
        ],
        "size":3,
        "contribution": 0.0438,
        'weightage':[1,0.75,0.5,0.25]
    },
    {
        "id": 14,
        "text":"Average net IRR generated by last Fund" ,
        "options":[
            ">=25%",
            ">=18% & <25%",
            ">=10% & <18%",
            "<10%"
        ],
        "size":3,
        "contribution": 0.0438,
        'weightage':[1,0.75,0.5,0.25]
    },
    {
        "id": 15,
        "text":"Target IRR of the current Fund" ,
        "options":[
            ">=25%",
            ">=18% & <25%",
            ">=10% & <18%",
            "<10%"
        ],
        "size":3,
        "contribution": 0.0438,
        'weightage':[1,0.75,0.5,0.25]
    },
    {
        "id": 16,
        "text":"Distributions to Paid-in-Capital in Previous Funds in case of fund wind up only" ,
        "options":[
            ">=3x",
            ">=2x & <3x",
            ">=1x & <2x",
            "<1x"
        ],
        "size":3,
        "contribution": 0.0438,
        'weightage':[1,0.75,0.5,0.25]
    },
    {
        "id": 17,
        "text":"Number of LPs with exposure >5% of last Fund corpus who continue to invest in the proposed fund" ,
        "options":[
            ">=5",
            ">=3 & <5",
            ">=1 & <3",
            "LP show interest"
        ],
        "size":3,
        "contribution": 0.0438,
        'weightage':[1,0.75,0.5,0.25]
    }
    ]
  }
 



  