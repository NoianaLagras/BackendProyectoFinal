import dotenv from 'dotenv';

dotenv.config();
export default {
    mongo_uri : process.env.MONGO_URI,
    secret_jwt : process.env.SECRET_KEY_JWT,
    git_client_id : process.env.GITHUB_CLIENT_ID,
    git_client_secret  : process.env.GITHUB_CLIENT_SECRET,
    secret_session  : process.env.SECRET_SESSION,

}
