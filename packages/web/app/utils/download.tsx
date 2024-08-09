export function download(url: string, name: string) {
  const a = document.createElement("a");
  a.setAttribute("href", url);
  a.setAttribute("download", name);
  a.click();
}
