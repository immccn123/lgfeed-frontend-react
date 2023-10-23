export function randomString(
  length: number,
  stringSet: string = "1234567890poiuytrewqasdfghjklmnbvcxzQWERTYUIOPLKJHGFDSAZXCVBNM",
) {
  const len = stringSet.length;
  let result = "";
  for (let _ = 0; _ < length; _++)
    result += stringSet.charAt(Math.floor(Math.random() * len));
  return result;
}
