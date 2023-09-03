export async function validateTurnstileToken(token: string) {
  let formData = new FormData();
  const { TURNSTILE_SECRET } = process.env;
  formData.append("secret", TURNSTILE_SECRET as string);
  formData.append("response", token);

  const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const result = await fetch(url, {
    body: formData,
    method: "POST",
  });
  const resultOutcome: { success: boolean } = await result.json();
  return resultOutcome;
}
