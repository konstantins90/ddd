/**
 * Build a German Wiktionary article URL from the omnibox query.
 * Spaces become underscores (MediaWiki path convention); other characters
 * are percent-encoded.
 */
function wiktionaryUrl(text) {
  const term = text.trim().replace(/\s+/g, "_");
  if (!term) {
    return "https://de.wiktionary.org/";
  }
  // encodeURIComponent encodes "_" as "_"; decode path separators if any
  // were typed — MediaWiki titles should not contain raw "/".
  const encoded = encodeURIComponent(term);
  return `https://de.wiktionary.org/wiki/${encoded}`;
}

chrome.omnibox.setDefaultSuggestion({
  description: "Auf de.wiktionary.org nach <match>%s</match> suchen",
});

chrome.omnibox.onInputEntered.addListener((text, disposition) => {
  const url = wiktionaryUrl(text);

  const open = (targetUrl) => {
    if (disposition === "currentTab") {
      chrome.tabs.update({ url: targetUrl });
    } else {
      chrome.tabs.create({ url: targetUrl });
    }
  };

  open(url);
});
