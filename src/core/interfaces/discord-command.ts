import {
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
} from "discord.js";

export interface DiscordCommand {
	data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
	execute: Function;
	autocomplete?: Function;
}
