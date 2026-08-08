import { body } from "express-validator";

const createIntakeValidator = [
    body("amount")
      .exists()
      .withMessage("Water intake amount is required")
      .isNumeric()
      .withMessage("Water intake amount must be a number")
      .custom((value) => {
        if (Number(value) <= 0) {
          throw new Error("Water intake amount must be greater than 0");
        }
  
        return true;
      }),
  ];

  export default createIntakeValidator