'use strict';
import BigNumber from 'bignumber.js';

export const RoundDownBigNumberPlacesFour = BigNumber.clone({
  DECIMAL_PLACES: 4,
  ROUNDING_MODE: BigNumber.ROUND_DOWN
});

export const RoundDownBigNumberPlacesEighteen = BigNumber.clone({
  DECIMAL_PLACES: 18,
  ROUNDING_MODE: BigNumber.ROUND_DOWN
});
