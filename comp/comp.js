function parse(text) {
  var data = [];
  text = text.replace(/get /g, "get$");
  text = text.replace(/set /g, "set$");
  var lines = text.split("\n");
  var pkg = function () {
    var x = rest.split("::");
    rest = x.pop();
    return x.length ? x.pop() : "";
  };
  var cls = function () {
    var x = rest.split("/");
    rest = x.pop();
    return x.length ? x.pop() : "";
  };
  var mth = function () {
    var x = rest.split(" ");
    rest = x.pop();
    return x.length ? x.pop().split("$").join(" ") : "";
  };
  var sts = function () {   // status = {0, 1}
    var x = rest.split("\t");
    if (x.length === 1) {
      var sts = undefined;
    } else {
      var sts = x.pop().trim();
    }
    return sts;
  }
  var rest;
  lines.forEach(function(v, i) {
    rest = v.trim();
    var r = {};
    if (rest) {
      data.push({
        pkg: pkg(),
        cls: cls(),
        mth: mth(),
        sts: sts(),
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
  var add = function (p, c, m, s) {
    var child = getChild(getChild(getChild(model, p), c), m)
    // if we have 's', then we use this child just for status. don't add a child
    if (s === undefined) {
      if (!child.sites) {
        child.sites = [];
      }
      child.sites.push(site);
    } else {
      child.status = s;
    }
    delete child["children"];
  };
  data.forEach(function (v, i) {
    add(v.pkg, v.cls, v.mth, v.sts);
  });
  return model;
}

var sites = [
/*
  "beta.abc.go.com_shows",
  "live.wsj.com",
  "movies.uk.msn.com",
  "video.foxnews.com",
  "www.aljazeera.com_video_",
  "www.bbc.co.uk",
  "www.bing.com_?scope=video",
  "www.cbc.ca_player",
  "www.cnn.com_video",
  "www.dailymotion.com",
  "www.grindtv.com",
  "www.guardian.co.uk_video",
  "www.hulu.com",
  "www.liveleak.com",
  "www.nbc.com_video_",
  "www.ted.com",
  "www.twitch.tv",
  "www.ustream.tv_new",
  "www.vevo.com",
  "www.facebook.com",
*/
  "www.funnyordie.com",
  "www.vimeo.com",
  "www.youtube.com",
  "status",
];

sites.forEach(function (v, i) {
  transform(parse(snarf("../in/"+v+".api.tsv")), v);
})

print(JSON.stringify(model, null, 2));

print(arguments);
