P105
====

Reingold–Tilford Tree of Flash APIs

STEPS
=====
- capture calls using Flash Player Debugger plugin
- sort for uniqueness and dump into www.site.com.tsv (or the like)
- execute ./intersect-site-with-api.sh www.site.com
- if its a new site, execute ./add-new-site.sh www.site.com
- execute ./compile-graph.sh
