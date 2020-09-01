'use strict';
import { UPDATE_TOADDRESS_VALIDATION } from '../constants/ActionTypes';
import LogUtilities from '../utilities/LogUtilities.js';

export function updateToAddressValidation(validation: any) {
  return async function (dispatch: any) {
    try {
      dispatch(updateToAddressValidationSuccess(validation));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const updateToAddressValidationSuccess = (validation: any) => ({
  type: UPDATE_TOADDRESS_VALIDATION,
  payload: validation
});
