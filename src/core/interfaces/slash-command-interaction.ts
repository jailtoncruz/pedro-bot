import { CommandInteraction } from "discord.js";
import { DiscordMusicBot } from "./discord-bot";

export class SlashCommandInteraction extends CommandInteraction {
	declare client: DiscordMusicBot<true>;
}
