'use strict';
import { store } from '../store/store';
import { saveFcmMsg, appendFcmMsg } from '../actions/ActionFcmMsgs';

class FcmMsgsParser {
  fcmMsgsSaver(fcmMsg) {
    const stateTree = store.getState();
    const fcmMsgs = stateTree.ReducerFcmMsgs.fcmMsgs;

    if (
      Object.entries(fcmMsgs).length === 0 &&
      fcmMsgs.constructor === Object
    ) {
      store.dispatch(saveFcmMsg(fcmMsg));
    } else if (
      !(
        Object.entries(fcmMsgs).length === 0 && fcmMsgs.constructor === Object
      ) &&
      Object.keys(fcmMsgs)[0] === fcmMsg.uid
    ) {
      store.dispatch(appendFcmMsg(fcmMsg));
    }
  }

  fcmMsgsToTransactions(fcmMsg) {
    const stateTree = store.getState();
    const fcmMsgs = stateTree.ReducerFcmMsgs.fcmMsgs;

    const sortedFcmMsgs = fcmMsgs[fcmMsg.uid].sort(
      (a, b) => parseInt(a.no) - parseInt(b.no)
    );
    let transactions = sortedFcmMsgs.map((el) => el.data).join('');
    transactions = JSON.parse(transactions);
    return transactions;
  }
}

export default new FcmMsgsParser();
