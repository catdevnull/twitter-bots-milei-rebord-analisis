# acceder datasets

por los bajos limites de tamaño de archivo en GitHub, los datasets grandes están en [esta carpeta en Drive](https://drive.google.com/drive/folders/1E-YRFkDWXC-xdWO4yR_-HOqmnP9DVPAv?usp=sharing).

# datasets

## bots

los ultimos 20 tweets (y retweets) de cada uno de los 12.5k bots detectados.

## bots2

los ultimos 150 tweets (y retweets) de cada uno de los 12.5k bots detectados, porque `bots` solo incluia ~2k retweets de cada tweet, porque muchos de los bots tweetean/retweetean tan seguido que los retuits a Milei/Rebord no entraban en los ultimos 20.

## filtered-bots2.jsonl

bots2 pero filtrado para solo incluir los tweets buscados (bots2 es 8GB+ descomprimido y 1.6+ millones de tweets). notese que hice la filtración con grep; así que hay unos tweets irrelacionados.

## bots-retweeters.jsonl

un archivo generado por `node analizar.mjs | sort | uniq -u` a partir de `milei` y `rebord` con las ids y nombres de usuarios de los usuarios que dieron positivo el test de bot.

## `milei` y `rebord`

este tiene varios tipos de datos, de varios tweets (incluyendo algunos que después de analizarlos se concluyó que no tenían bots):

- `[tweet id].json`: el json del tweet en si
- `[tweet id].likers.jsonl`: todos los usuarios que likearon el tweet
- `[tweet id].retweeters.jsonl`: todos los usuarios que retweetearon el tweet

# compresión

los datasets "grandes" (`bots` y `bots2`) están comprimidos con [ZSTD](https://github.com/facebook/zstd) con un tar adentro (porque ZSTD comprime muy bien y descomprime rápido). deberías poder descomprimirlo en cualquier linux instalando zstd (está en todas las distros) y corriendo `tar -xvf $ARCHIVO.tar.zst`.

los datasets "chicos" (`filtered-bots2.jsonl`) están comprimidos con gzip para hacerlos más fácil de descomprimir. podés descomprimirlos con `gzip -d $ARCHIVO.gz`.
