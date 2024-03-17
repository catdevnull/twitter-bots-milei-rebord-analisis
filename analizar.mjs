import { readFile, readdir } from "node:fs/promises";
import { basename, join } from "node:path";

// samples formato de datos

// {"id": 1768953236864545029, "id_str": "1768953236864545029", "url": "https://twitter.com/JMilei/status/1768953236864545029", "date": "2024-03-16 10:51:31+00:00", "user": {"id": 4020276615, "id_str": "4020276615", "url": "https://twitter.com/JMilei", "username": "JMilei", "displayname": "Javier Milei", "rawDescription": "Economista", "created": "2015-10-22 23:47:47+00:00", "followersCount": 2749962, "friendsCount": 1154, "statusesCount": 228471, "favouritesCount": 455236, "listedCount": 3025, "mediaCount": 4605, "location": "Buenos Aires, Argentina", "profileImageUrl": "https://pbs.twimg.com/profile_images/1553931112262549505/XTcdwp0b_normal.jpg", "profileBannerUrl": "https://pbs.twimg.com/profile_banners/4020276615/1458666862", "protected": null, "verified": false, "blue": true, "blueType": null, "descriptionLinks": [], "_type": "snscrape.modules.twitter.User"}, "lang": "es", "rawContent": "FELIZ CUMPLEA\u00d1OS DOCTOR...!!!\nMuchas gracias por tantas alegr\u00edas y en especial por las ense\u00f1anzas para la vida...!!! https://t.co/bYNoNv7Wrt", "replyCount": 712, "retweetCount": 2477, "likeCount": 25884, "quoteCount": 91, "conversationId": 1768953236864545029, "conversationIdStr": "1768953236864545029", "hashtags": [], "cashtags": [], "mentionedUsers": [], "links": [], "viewCount": 842346, "retweetedTweet": null, "quotedTweet": null, "place": null, "coordinates": null, "inReplyToTweetId": null, "inReplyToTweetIdStr": null, "inReplyToUser": null, "source": "<a href=\"http://twitter.com/download/android\" rel=\"nofollow\">Twitter for Android</a>", "sourceUrl": "http://twitter.com/download/android", "sourceLabel": "Twitter for Android", "media": {"photos": [{"url": "https://pbs.twimg.com/media/GIyVmBeXMAE1jlo.jpg"}], "videos": [], "animated": []}, "_type": "snscrape.modules.twitter.Tweet"}

// {"id": 303959452, "id_str": "303959452", "url": "https://twitter.com/ChinoDarko", "username": "ChinoDarko", "displayname": "ODIO.", "rawDescription": "25 - Fot\u00f3grafo - vago -\n\nPonele que estoy estudiando cine.", "created": "2011-05-23 18:08:06+00:00", "followersCount": 293, "friendsCount": 338, "statusesCount": 43906, "favouritesCount": 408381, "listedCount": 4, "mediaCount": 1040, "location": "En el chino de tu barrio", "profileImageUrl": "https://pbs.twimg.com/profile_images/1746587402481565696/bnFX_DLY_normal.jpg", "profileBannerUrl": "https://pbs.twimg.com/profile_banners/303959452/1440447821", "protected": null, "verified": false, "blue": false, "blueType": null, "descriptionLinks": [], "_type": "snscrape.modules.twitter.User"}

// gracias @hookdump
function getFlags(user) {
  const fecha = new Date(user.created);
  const ahora = new Date();
  const diferencia = ahora - fecha;
  const dias = diferencia / (1000 * 60 * 60 * 24);
  return {
    pocosFollowers: user.followersCount < 10,
    nombre: /\d{4,}$/.test(user.username),
    reciente: dias < 60,
  };
}

/** @param {string} path */
async function checkBots(path) {
  let bots = 0;
  let total = 0;
  const file = await readFile(path, "utf-8");
  for (const line of file.split("\n")) {
    if (!line) continue;
    total++;
    const user = JSON.parse(line);
    const flags = getFlags(user);
    if (flags.nombre && flags.pocosFollowers && flags.reciente) {
      bots++;
    }
  }
  return { bots, total, percent: bots / total };
}

/** @param {string} dir */
async function checkDir(dir) {
  for (const name of await readdir(dir)) {
    if (!name.endsWith(".json")) continue;
    const tweet = await readJsonFile(join(dir, name));
    const likersPath = join(dir, `${basename(name, ".json")}.likers.jsonl`);
    const likers = await checkBots(likersPath);
    const retweetersPath = join(
      dir,
      `${basename(name, ".json")}.retweeters.jsonl`
    );
    const retweeters = await checkBots(retweetersPath);
    console.log(
      [
        tweet.user.username,
        tweet.date,
        tweet.rawContent.split("\n")[0],
        likers.bots,
        likers.total,
        Math.floor(likers.percent * 100000) / 100000,
        retweeters.bots,
        retweeters.total,
        Math.floor(retweeters.percent * 100000) / 100000,
      ].join("\t")
    );
  }
}

if (process.argv[2]) console.debug(await checkBots());
else {
  for (const ref of ["rebord", "milei"]) {
    await checkDir(ref);
  }
}

/** @param {string} path */
async function readJsonFile(path) {
  const file = await readFile(path, "utf-8");
  return JSON.parse(file);
}
