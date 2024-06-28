require("dotenv").config();
const CryptoJS = require("crypto-js");
const util = require('util');
const { NCP_ID, NCP_SECRET_KEY, NCP_ACCESS_KEY, COMPANY_NUMBER } = process.env;
const axios = require("axios");

const endPoints = "https://sens.apigw.ntruss.com/sms/v2/services/%s/messages";

function genSignature(timestamp) {

    const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, NCP_SECRET_KEY);
    const method = "POST";
    const space = " ";
    const url = `/sms/v2/services/${NCP_ID}/messages`;
    const newLine = "\n";

    hmac.update(method);
    hmac.update(space);
    hmac.update(url);
    hmac.update(newLine);
    hmac.update(timestamp);
    hmac.update(newLine);
    hmac.update(NCP_ACCESS_KEY);
    const hash = hmac.finalize();
    return hash.toString(CryptoJS.enc.Base64);
}


async function sendAuth(phone, authcode) {
    try {
        const timestamp = Date.now().toString();
        await axios.post(util.format(endPoints, NCP_ID), {
            type: "SMS",
            contentType: "COMM",
            countryCode: "82",
            from : COMPANY_NUMBER,
            content: util.format("루트큐에서 보낸 인증번호 입니다.\n인증번호: %s", "["+authcode+"]"),
            messages: [
                {
                    to: phone
                },
            ]
        }, {
            headers: {
                "Content-Type" : "application/json; charset=utf-8",
                "x-ncp-apigw-timestamp" : timestamp,
                "x-ncp-iam-access-key" : NCP_ACCESS_KEY,
                "x-ncp-apigw-signature-v2" : genSignature(timestamp)
            }
        });
        return;
    } catch (error) {
        throw error;
    }
}
module.exports = {sendAuth}