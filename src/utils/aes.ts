import CryptoJS from "crypto-js"

export const aes = {
    encrypt(text: string, password: string) {
        return CryptoJS.AES.encrypt(text, password).toString()
    },
    decrypt(hash: string, password: string) {
        return CryptoJS.AES.decrypt(hash, password).toString(CryptoJS.enc.Utf8)
    }
}