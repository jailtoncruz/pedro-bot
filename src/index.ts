import { DiscordMusicBot } from "./core/interfaces/discord-bot";
import { GatewayIntentBits } from "discord.js";

const { Guilds, GuildVoiceStates, GuildMessages, MessageContent } =
	GatewayIntentBits;

const client = new DiscordMusicBot({
	intents: [Guilds, GuildVoiceStates, GuildMessages, MessageContent],
});
client.login(client.config.token);
