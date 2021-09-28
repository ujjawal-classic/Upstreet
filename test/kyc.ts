import { expect } from "chai";
import kyc from "../source/controllers/kyc";

describe("KYC Check", () => {
  it("Throw birthdate validation error", async () => {
    let result = await kyc.kycCheck({
      birthDate: "1996-10",
      givenName: "dddd",
      familyName: "ccccc",
      licenceNumber: "ddddd",
      stateOfIssue: "SA",
    });
    expect(result).to.have.deep.members([{ err: "BirthDate Format YYYY-MM-DD!" }]);
  });

  it("Throw state if issue error", async () => {
    let result = await kyc.kycCheck({
      birthDate: "1996-10-30",
      givenName: "dddd",
      familyName: "ccccc",
      licenceNumber: "ddddd",
      stateOfIssue: "SAww",
    });
    expect(result).to.have.deep.members([
      { err: "State must be in NSW,QLD, SA, TAS, VIC, WA, ACT, NT!" },
    ]);
  });

  it("Throw required error", async () => {
    let result = await kyc.kycCheck({
      birthDate: "",
      givenName: "",
      familyName: "",
      licenceNumber: "",
      stateOfIssue: "",
    });
    expect(result).to.have.deep.members([
      { err: "BirthDate is required field" },
      { err: "BirthDate Format YYYY-MM-DD!" },
      { err: "FirstName is required field" },
      { err: "LastName is required field" },
      { err: "LicenceNumber is required field" },
      { err: "State must be in NSW,QLD, SA, TAS, VIC, WA, ACT, NT!" },
    ]);
  });

  it("Throw maximum length error", async () => {
    let result = await kyc.kycCheck({
      birthDate: "1996-10-30",
      givenName:
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      familyName: "ccccc",
      licenceNumber: "ddddd",
      stateOfIssue: "SA",
    });
    expect(result).to.have.deep.members([
      { err: "FirstName maximum 100 characters required!" },
    ]);
  });
});
