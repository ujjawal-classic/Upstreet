import kyc from "./controllers/kyc";

kyc.kycCheck(JSON.parse(process.argv[2]));
