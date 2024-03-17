## pedir datos con twscrape

```
#!/usr/bin/fish
cd rebord # o milei/
# --db ~/proy/milei-twitter/scraper-py/accounts.db
for id in (cat tweets.txt)
    twscrape tweet_details $id > $id.json
end
for id in (cat tweets.txt)
    twscrape favoriters $id > $id.likers.jsonl
end
for id in (cat tweets.txt)
    twscrape retweeters $id > $id.retweeters.jsonl
end
```
