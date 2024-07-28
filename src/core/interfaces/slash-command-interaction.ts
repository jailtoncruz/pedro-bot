import { CommandInteraction, AutocompleteInteraction } from "discord.js";
import { DiscordMusicBot } from "./discord-bot";

export class SlashCommandInteraction extends CommandInteraction {
	declare client: DiscordMusicBot<true>;
}

export class SlashAutocompleteInteraction extends AutocompleteInteraction {
	declare client: DiscordMusicBot<true>;
}
