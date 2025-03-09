let options_plain = ["http-proxy", "https-proxy", "socks-host", "auto-proxy"];
let options_chk = ["dont-prompt-auth", "proxy-dns-when-using-socks","http-https-proxy"];

function queryPreference(name) {
  return document.querySelector('input[name="' + name + '"]');
}

function applyOptions(options, preferences, selector, assigner) {
  for (const option of options) {
    let el = selector(option);
    if (el && preferences[option]) {
      assigner(el, preferences[option]);
    }
  }
}

function setStoredPreferences(sl) {
  let preferences = sl["preferences"];
  if (preferences == null) {
    return;
  }
  applyOptions(options_plain, preferences, queryPreference, (el, p) => { el.value = p; });
  applyOptions(options_chk, preferences, queryPreference, (el, p) => { el.checked = p; });
  applyOptions(["socks4"], preferences, queryPreference, (el, p) => { el.checked = p === 4; });
  applyOptions(['no-proxy-for'], preferences,
    _ => document.querySelector('textarea[name="no-proxy-for"]'),
    (el, p) => { el.value = p });
}

function setPreference(options, preferences, selector, extractor) {
  for (const option of options) {
    let el = selector(option);
    preferences[option] = extractor(el);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("save-preferences").addEventListener("click", async function () {
    let preferences = {};
    setPreference(options_plain, preferences, queryPreference, e => e.value);
    setPreference(options_chk, preferences, queryPreference, e => e.checked);
    setPreference(["socks4"], preferences, queryPreference, e => e.checked ? 4 : 5);
    setPreference(["no-proxy-for"], preferences,
      _ => document.querySelector('textarea[name="no-proxy-for"]'),
      e => e.value );
    browser.storage.local.set({"preferences": preferences});
  });
});


browser.storage.local.get().then(setStoredPreferences);
