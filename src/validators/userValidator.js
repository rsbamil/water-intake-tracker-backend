import {body} from "express-validator"

const updateGoalValidator = [
    body("dailyGoal")
      .exists()
      .withMessage("Daily goal is required")
      .isNumeric()
      .withMessage("Daily goal must be a number")
      .custom((value) => {
        if (Number(value) <= 0) {
          throw new Error("Daily goal must be greater than 0");
        }
  
        return true;
      }),
  ];

  export default updateGoalValidator