// js/country.js
// Stores user's country preference + provides currency formatting + default rates.
// Works with static sites (GitHub Pages). No backend needed.

const TL_COUNTRY_KEY = "tharvion_country_v1";

const THARVION_COUNTRIES = [
  { code: "LK", name: "Sri Lanka", currency: "LKR", symbol: "LKR", locale: "en-LK", defaultLoanRate: 18, defaultSavingsRate: 10, defaultInflation: 7 },
  { code: "IN", name: "India", currency: "INR", symbol: "₹",   locale: "en-IN", defaultLoanRate: 12, defaultSavingsRate: 7,  defaultInflation: 5 },
  { code: "US", name: "United States", currency: "USD", symbol: "$", locale: "en-US", defaultLoanRate: 8,  defaultSavingsRate: 4,  defaultInflation: 3 },
  { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£", locale: "en-GB", defaultLoanRate: 7,  defaultSavingsRate: 4,  defaultInflation: 3 },
  { code: "AU", name: "Australia", currency: "AUD", symbol: "$", locale: "en-AU", defaultLoanRate: 8,  defaultSavingsRate: 4,  defaultInflation: 3 },
  { code: "CA", name: "Canada", currency: "CAD", symbol: "$", locale: "en-CA", defaultLoanRate: 8,  defaultSavingsRate: 4,  defaultInflation: 3 },
  { code: "SG", name: "Singapore", currency: "SGD", symbol: "$", locale: "en-SG", defaultLoanRate: 6,  defaultSavingsRate: 3,  defaultInflation: 3 },
  { code: "AE", name: "UAE", currency: "AED", symbol: "AED", locale: "en-AE", defaultLoanRate: 6,  defaultSavingsRate: 3,  defaultInflation: 3 },
];

function tharvionGuessCountryCode() {
  // Best-effort guess (not perfect). User can override via dropdown.
  const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").toLowerCase();
  const lang = (navigator.language || "").toLowerCase();

  if (tz.includes("colombo") || lang.includes("en-lk")) return "LK";
  if (tz.includes("kolkata") || tz.includes("calcutta") || lang.includes("en-in")) return "IN";
  if (tz.includes("london") || lang.includes("en-gb")) return "GB";
  if (tz.includes("new_york") || tz.includes("los_angeles") || lang.includes("en-us")) return "US";
  if (tz.includes("sydney") || lang.includes("en-au")) return "AU";
  if (tz.includes("toronto") || lang.includes("en-ca")) return "CA";
  if (tz.includes("singapore") || lang.includes("en-sg")) return "SG";
  if (tz.includes("dubai") || lang.includes("en-ae")) return "AE";

  return "LK"; // safe default for your audience
}

function tharvionGetCountry(code) {
  return THARVION_COUNTRIES.find(c => c.code === code) || THARVION_COUNTRIES[0];
}

function tharvionGetSelectedCountry() {
  const stored = localStorage.getItem(TL_COUNTRY_KEY);
  if (stored) return tharvionGetCountry(stored);
  const guessed = tharvionGuessCountryCode();
  localStorage.setItem(TL_COUNTRY_KEY, guessed);
  return tharvionGetCountry(guessed);
}

function tharvionSetSelectedCountry(code) {
  localStorage.setItem(TL_COUNTRY_KEY, code);
}

function tharvionFormatMoney(amount) {
  const c = tharvionGetSelectedCountry();
  try {
    // Uses proper currency formatting per locale
    return new Intl.NumberFormat(c.locale, { style: "currency", currency: c.currency }).format(amount);
  } catch {
    // fallback
    return `${c.symbol} ${Number(amount).toFixed(2)}`;
  }
}

function tharvionInitCountrySelector() {
  const sel = document.getElementById("countrySelect");
  const label = document.getElementById("countryLabel");
  if (!sel) return;

  // Fill dropdown options
  sel.innerHTML = THARVION_COUNTRIES.map(c => `<option value="${c.code}">${c.name}</option>`).join("");

  // Set current value
  const current = tharvionGetSelectedCountry();
  sel.value = current.code;
  if (label) label.textContent = current.name;

  // On change -> save + reload to apply defaults everywhere
  sel.addEventListener("change", () => {
    tharvionSetSelectedCountry(sel.value);
    location.reload();
  });
}

// Make utilities accessible to other scripts
window.TL = {
  countries: THARVION_COUNTRIES,
  getSelected: tharvionGetSelectedCountry,
  setSelected: tharvionSetSelectedCountry,
  formatMoney: tharvionFormatMoney,
  initSelector: tharvionInitCountrySelector
};

document.addEventListener("DOMContentLoaded", tharvionInitCountrySelector);
