function parse(text) {
  var data = [];
  text = text.replace(/get /g, "get$");
  text = text.replace(/set /g, "set$");
  var lines = text.split("\n");
  var pack = function () {
    var x = rest.split("::");
    rest = x.pop();
    return x.length ? x.pop() : "";
  };
  var clas = function () {
    var x = rest.split("/");
    rest = x.pop();
    return x.length ? x.pop() : "";
  };
  var meth = function () {
    var x = rest.split(" ");
    rest = x.pop();
    return x.length ? x.pop().split("$").join(" ") : "";
  };
  var rest;
  lines.forEach(function(v, i) {
    rest = v.trim();
    var r = {};
    if (rest) {
      data.push({
        package: pack(),
        class: clas(),
        method: meth(),
      });
    }
  });
  return data;
}

var model = { name: "root", children: []};

function transform(data, site) {
  var getChild = function (parent, name) {
    var child = null;
    parent.children.forEach(function (v, i) {
      if (v.name === name) {
        child = v;
      }
    });
    if (child === null) {
      child = {name: name, children: []};
      parent.children.push(child);
    }
    return child;
  };
  var add = function (p, c, m) {
    var child = getChild(getChild(getChild(model, p), c), m)
    if (!child.sites) {
      child.sites = [];
    }
    child.sites.push(site);
    delete child["children"];
  };
  data.forEach(function (v, i) {
    add(v["package"], v["class"], v["method"], v["count"]);
  });
  return model;
}

var sites = [
/*
  "beta.abc.go.com_shows",
  "live.wsj.com",
  "movies.uk.msn.com",
  "video.foxnews.com",
  "vimeo.com",
  "www.aljazeera.com_video_",
  "www.bbc.co.uk",
  "www.bing.com_?scope=video",
  "www.cbc.ca_player",
  "www.cnn.com_video",
  "www.dailymotion.com",
  "www.facebook.com",
  "www.funnyordie.com",
  "www.grindtv.com",
  "www.guardian.co.uk_video",
  "www.hulu.com",
  "www.liveleak.com",
  "www.nbc.com_video_",
  "www.ted.com",
  "www.twitch.tv",
  "www.ustream.tv_new",
  "www.vevo.com",
*/
  "www.youtube.com",
];

sites.forEach(function (v, i) {
  transform(parse(snarf("../in/"+v+".tsv")), v);
})

print(JSON.stringify(model, null, 2));
