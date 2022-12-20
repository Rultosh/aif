export async function getEligibilityQuestions () {
    return await (await fetch('http://localhost:5000/eligibilityQuestions', {
        method: "GET",
        headers: {
            Accept: "application/json",
            "content-type" : "application/json"
        }
    })).json();
}


type credentials = {
    name:string,
    password:string
} 
export async function verifyUserIsValid (obj:credentials) {
    let bdy = JSON.stringify(obj);
    console.log('body',bdy)
    return await (await fetch('https://salty-headland-21861.herokuapp.com/api/registeredusers/validate', {
        method: "POST",
        //mode: 'no-cors',
        body: bdy,//JSON.stringify(obj),
        headers: {
            //Server: "Cowboy",
            //Connection:"keep-alive",
            //Accept: "application/json",
            "Content-type" : "application/json"
        }
    }));
}

export async function getUsers () {
    return  await fetch('https://salty-headland-21861.herokuapp.com/api/users', {
        method: "GET",
       
        headers: {
            Accept: "application/json",
            "content-type" : "application/json"
        }
    }).then(res =>{
        if (!res.ok) {
            throw `Server error: [${res.status}] [${res.statusText}] [${res.url}]`;
        }
        return res.json();
    }) .then(receivedJson => {
        console.log(receivedJson)
       
    })
    .catch(err => {
        console.debug("Error in fetch", err);
       
    });
}
