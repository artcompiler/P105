cat ../in/flash-api.tsv > temp
cat ../in/$1.tsv >> temp
sort temp | uniq -d > ../in/$1.api.tsv
cat ../in/flash-native-api.tsv > temp
cat ../in/$1.tsv >> temp
sort temp | uniq -d > ../in/$1.native.tsv
