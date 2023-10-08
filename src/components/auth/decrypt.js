const decrypt = (password) => {
    if(password != null) {
        var passcode = "sidbi@123";
        password = password.replace("[", "");
        password = password.replace("]", "");
        var codesArry = password.split(",");
        var result = "";
        for(var i = 0; i < codesArry.length; i++) {
            var passOffset = i%passcode.length;
            var calAscii = (codesArry[i])-(passcode.charCodeAt(passOffset));
            result += String.fromCharCode(calAscii);
        }
        return JSON.stringify(result);
    }
}

export default decrypt;
