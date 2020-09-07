"use strict";
import { CLEAR_QRCODE_DATA, SAVE_QRCODE_DATA } from "../constants/ActionTypes";

const INITIAL_STATE = {
  qrCodeData: null
};

const qrCodeData = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case CLEAR_QRCODE_DATA:
      return { qrCodeData: null };
    case SAVE_QRCODE_DATA:
      return { ...state, qrCodeData: action.payload };
    default:
      return state || INITIAL_STATE;
  }
};

export default qrCodeData;
