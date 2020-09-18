"use strict";
import { CLEAR_QRCODE_DATA, SAVE_QRCODE_DATA } from "../constants/ActionTypes";
import LogUtilities from "../utilities/LogUtilities";

export function clearQRCodeData() {
  return async function (dispatch: any) {
    try {
      dispatch(clearQRCodeDataSuccess());
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const clearQRCodeDataSuccess = () => ({
  type: CLEAR_QRCODE_DATA
});

export function saveQRCodeData(qrCodeData: any) {
  return async function (dispatch: any) {
    try {
      dispatch(saveQRCodeDataSuccess(qrCodeData));
    } catch (err) {
      LogUtilities.logError(err);
    }
  };
}

const saveQRCodeDataSuccess = (qrCodeData: any) => ({
  type: SAVE_QRCODE_DATA,
  payload: qrCodeData
});
