import { TwitterApi } from 'twitter-api-v2';


let client, bearer;

const twitterClient = () => {
  try {
    client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: process.env.TWITTER_ACCESS_TOKEN,
      accessSecret: process.env.TWITTER_ACCESS_SECRET,
    });

    return client.readWrite;
  
  } catch (error) {
      console.log(error);
      return null;
  }
}

const twitterBearer = () => {
  try {
    
    bearer = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);

    return bearer.readOnly;
  
  } catch (error) {
      console.log(error);
      return null;
  }
}

export { twitterClient, twitterBearer };