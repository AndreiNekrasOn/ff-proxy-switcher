function setChecked(sl) {
  let settings = sl["settings"];
  if (settings == null) {
    settings = { proxyType: "none" };
  }
  let t = settings.proxyType;
  document.querySelector('input[name="proxy-type"][value="' + t + '"]').checked = true;
}

function getDefaultPreferences() {
  return {
    autoConfigUrl: "",
    autoLogin: false,
    http: "",
    httpProxyAll: false,
    passthrough: "",
    proxyDNS: true,
    socks: "",
    socksVersion: 5,
    ssl: "",
  };
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("switch-btn").addEventListener("click", async function () {
    let preferences = (await browser.storage.local.get())["preferences"];
    if (preferences == null) {
      preferences = getDefaultPreferences();
      browser.storage.local.set({"preferences": preferences});
    }
    let proxySettings = {
      proxyType: document.querySelector('input[name="proxy-type"]:checked').value,
      autoConfigUrl: preferences['auto-proxy'],
      autoLogin: preferences['dont-prompt-auth'],
      http: preferences['http-proxy'],
      httpProxyAll: preferences['http-https-proxy'],
      passthrough: preferences['no-proxy-for'],
      proxyDNS: preferences['proxy-dns-when-using-socks'],
      socks: preferences['socks-host'],
      socksVersion: preferences['socks4'],
      ssl: preferences['https-proxy'],
    };
    browser.proxy.settings.set({value: proxySettings});
    browser.storage.local.set({"settings": proxySettings});
  });
});

browser.storage.local.get().then(setChecked);
