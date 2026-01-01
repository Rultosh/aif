import { encryptData } from "./encryption";

const encrypt = (password) => {
    const payload = encryptData(password);
    return JSON.stringify(payload);
}

export default encrypt;