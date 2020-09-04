"use strict";
import { UPDATE_TOADDRESS_VALIDATION } from "../constants/ActionTypes";
import LogUtilities from "../utilities/LogUtilities.js";

export function updateToAddressValidation(validation) {
  return async function (dispatch) {
    try {
      dispatch(updateToAddressValidationSuccess(validation));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const updateToAddressValidationSuccess = (validation) => ({
  type: UPDATE_TOADDRESS_VALIDATION,
  payload: validation
});
