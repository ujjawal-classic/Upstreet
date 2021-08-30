import express from 'express';
import controller from '../controllers/kyc';
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

const router = express.Router();

router.post('/kyc-check',

    body('birthDate', 'BirthDate Format YYYY-MM-DD!').matches(/^\d{4}-\d{2}-\d{2}$/),
    body('givenName', 'Maximum 100 characters required!').isLength({ min: 1, max: 100 }),
    body('middleName', 'Maximum 100 characters required!').isLength({ max: 100 }).optional(true),
    body('familyName', 'Maximum 100 characters required!').isLength({ min: 1, max: 100 }),
    body('licenceNumber', 'LicenceNumber can not be empty!').isLength({ min: 1 }),
    body('stateOfIssue', 'State must be in NSW,QLD, SA, TAS, VIC, WA, ACT, NT!').isLength({ min: 1 }).isIn(['NSW', 'QLD', 'SA', 'TAS', 'VIC', 'WA', 'ACT', 'NT']),
    body('expiryDate', 'ExpiryDate Format YYYY-MM-DD!').matches(/^\d{4}-\d{2}-\d{2}$/).optional(true),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },

    controller.kycCheck);

export = router;