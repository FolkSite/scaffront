var criticalCss = [];
//var csses = document.querySelectorAll('style, link[type$=css], link[rel=stylesheet]');
var csses = document.querySelectorAll('style, link');

var CurrentUrl;
if (window.NMUrl) {
  CurrentUrl = Url.parse(window.NMUrl);
} else {
  CurrentUrl = Url.parse(document.location.href);
}
var currentUrl = Url.format(CurrentUrl);

//throw currentUrl;

var css, tagName, url, rel, type;
var i = 0, length = csses.length;
var index = 0;
for (; i < length; i++) {
//while (i < length) {
  css = csses[i];
  tagName = css.tagName.toLowerCase();
  switch (tagName) {
    case 'style':
      criticalCss.push({
        index: index,
        type: 'content',
        content: css.innerHTML
      });
      index++;
      break;
    case 'link':
      url = css.getAttribute('href');
      type = css.getAttribute('type');
      rel = css.getAttribute('rel');
      if (rel == 'stylesheet' || /css$/i.test(type)) {
        criticalCss.push({
          index: index,
          type: 'url',
          url: Url.resolve(currentUrl, url)
        });
        index++;
      }
      break;
  }
  //i++;
}

window.criticalCss = criticalCss;
