export function randomString(
  length: number,
  stringCollection: string = "1234567890poiuytrewqasdfghjklmnbvcxzQWERTYUIOPLKJHGFDSAZXCVBNM",
) {
  const len = stringCollection.length;
  let result = "";
  for (let _ = 0; _ < length; _++)
    result += stringCollection.charAt(Math.floor(Math.random() * len));
  return result;
}
