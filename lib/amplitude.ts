// amplitude.ts
'use client';

import * as amplitude from '@amplitude/analytics-browser';

function initAmplitude() {
  if (typeof window !== 'undefined') {
    amplitude.init('f7df415fa938e85a1dc55532e6bc2e70', {"autocapture":true,"serverZone":"EU"});
  }
}

initAmplitude();

export const Amplitude = () => null;
export default amplitude;