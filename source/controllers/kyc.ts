import axios, { AxiosResponse } from "axios";
import { KycData } from "../modal/kyc";

const headers: Object = {
  "Content-Type": "application/json",
  Authorization:
    "Bearer 03aa7ba718da920e0ea362c876505c6df32197940669c5b150711b03650a78cf",
};

const dateFormat: RegExp = /^\d{4}-\d{2}-\d{2}$/;
const issueState: Array<string> = [
  "NSW",
  "QLD",
  "SA",
  "TAS",
  "VIC",
  "WA",
  "ACT",
  "NT",
];

// kyc check
const kycCheck = async (kycObj: KycData) => {
  let {
    birthDate,
    givenName,
    middleName,
    familyName,
    licenceNumber,
    stateOfIssue,
    expiryDate,
  } = kycObj;

  let errors = [];
  if (!birthDate) {
    errors.push({ err: "BirthDate is required field" });
  }
  if (!dateFormat.test(birthDate)) {
    errors.push({ err: "BirthDate Format YYYY-MM-DD!" });
  }
  if (!givenName) {
    errors.push({ err: "FirstName is required field" });
  }
  if (givenName.length > 100) {
    errors.push({ err: "FirstName maximum 100 characters required!" });
  }
  if (middleName && middleName.length > 100) {
    errors.push({ err: "MiddleName maximum 100 characters required!" });
  }
  if (!familyName) {
    errors.push({ err: "LastName is required field" });
  }
  if (familyName.length > 100) {
    errors.push({ err: "LastName maximum 100 characters required!" });
  }
  if (!licenceNumber) {
    errors.push({ err: "LicenceNumber is required field" });
  }
  if (issueState.indexOf(stateOfIssue) == -1) {
    errors.push({
      err: "State must be in NSW,QLD, SA, TAS, VIC, WA, ACT, NT!",
    });
  }
  if (expiryDate && !dateFormat.test(expiryDate)) {
    errors.push({ err: "ExpiryDate Format YYYY-MM-DD!" });
  }

  if (errors.length) {
    console.log(errors);
    return errors;
  }

  let response: AxiosResponse = await axios.post(
    `https://australia-southeast1-reporting-290bc.cloudfunctions.net/driverlicence`,
    {
      birthDate,
      givenName,
      middleName,
      familyName,
      licenceNumber,
      stateOfIssue,
      expiryDate,
    },
    { headers }
  );

  let kycCheckData = {};
  if (response && response.data) {
    if (response.data.verificationResultCode == "Y") {
      kycCheckData = {
        kycResult: true,
      };
    } else if (response.data.verificationResultCode == "N") {
      kycCheckData = {
        kycResult: false,
      };
    } else if (
      response.data.verificationResultCode == "D" ||
      response.data.verificationResultCode == "S"
    ) {
      kycCheckData = {
        code: "D or S",
        message: "Document Error or Server Error",
      };
    }
  }
  console.log(kycCheckData);
  return kycCheckData;
};

export default { kycCheck };
