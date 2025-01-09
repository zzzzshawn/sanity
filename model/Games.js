// model/Games.js
import { Schema as _Schema, models, model } from "mongoose";
const Schema = _Schema;

const GamesSchema = new Schema({
  name: { type: String, unique: true },
  category: String,
  profile: String,
  gameBannerPhoto: String,
});

const Games = models.Games || model("Games", GamesSchema);

export default Games;
