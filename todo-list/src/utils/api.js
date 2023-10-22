import axios from "axios";

const PASTEBIN_API_KEY = "YiabxSY_6middJUXX9rRLR1kq1p95Xx5";

export async function exportToPastebin(data) {
  const response = await axios.post("https://pastebin.com/api/api_post.php", {
    api_dev_key: PASTEBIN_API_KEY,
    api_option: "paste",
    api_paste_code: JSON.stringify(data),
  });
  return response.data;
}

export async function importFromPastebin(pasteID) {
  const response = await axios.get(`https://pastebin.com/raw/${pasteID}`);
  return JSON.parse(response.data);
}
