cat ../in/status.api.tsv > temp
cat ../in/$1.api.tsv >> temp
sort -u temp > ../in/status.api.tsv
