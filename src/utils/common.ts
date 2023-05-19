export function generateRandomNumber(digits: number): number {
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function splitMobileNoandSTDCode(mobileNumber: string) {
  return {
    mobile_no: Number(mobileNumber.slice(-10)),
    mobile_no_std_code: Number(mobileNumber.slice(0, -10)),
  };
}
