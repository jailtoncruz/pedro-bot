import { config } from "dotenv";
import { BotConfig } from "../core/interfaces/bot-config";
config();

export function getConfig(): BotConfig {
	return {
		token: getOrThrow("TOKEN"),
		clientId: getOrThrow("CLIENT_ID"),
		clientSecret: getOrThrow("CLIENT_SECRET"),
		youtubeAPIkey: getOrThrow("YOUTUBE_API_KEY"),
		spotifyClientId: getOrThrow("SPOTIFY_CLIENT_ID"),
		spotifyClientSecret: getOrThrow("SPOTIFY_CLIENT_SECRET"),
	};
}

function getOrThrow<T = string>(name: string) {
	const env = process.env[name];
	if (!env) throw new Error(`Environment [${name}] is undefined.`);
	return env as T;
}
