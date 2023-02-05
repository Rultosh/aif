const encrypt = (password) => {
    var passcode = process.env.REACT_APP_SALT;
    console.log(passcode)
    var result = [];
    var passLen = passcode.length;
    for(var i=0; i<password.length; i++) {
        var passOffset = i%passLen;
        var calAscii = (password.charCodeAt(i)+passcode.charCodeAt(passOffset));
        result.push(calAscii);
    }
    return JSON.stringify(result);
}

export default encrypt;