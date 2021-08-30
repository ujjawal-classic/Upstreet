import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer 03aa7ba718da920e0ea362c876505c6df32197940669c5b150711b03650a78cf'
}

// kyc check
const kycCheck = async (req: Request, res: Response, next: NextFunction) => {
    let birthDate: string = req.body.birthDate;
    let givenName: string = req.body.givenName;
    let middleName: string = req.body.middleName;
    let familyName: string = req.body.familyName;
    let licenceNumber: string = req.body.licenceNumber;
    let stateOfIssue: string = req.body.stateOfIssue;
    let expiryDate: string = req.body.expiryDate;

    let response: AxiosResponse = await axios.post(`https://australia-southeast1-reporting-290bc.cloudfunctions.net/driverlicence`, {
        birthDate,
        givenName,
        middleName,
        familyName,
        licenceNumber,
        stateOfIssue,
        expiryDate
    }, { headers });

    let kycCheckData = {};
    if (response && response.data) {
        if (response.data.verificationResultCode == 'Y') {
            kycCheckData = {
                kycResult: true
            };
        }
        else if (response.data.verificationResultCode == 'N') {
            kycCheckData = {
                kycResult: false
            };
        }
        else if (response.data.verificationResultCode == 'D' || response.data.verificationResultCode == 'S') {
            kycCheckData = {
                code: 'D or S',
                message: 'Document Error or Server Error'
            };
        }
    }
    return res.status(200).json(kycCheckData);
};

export default { kycCheck };