import {
	CommandInteraction,
	CommandInteractionOptionResolver,
	SlashCommandBuilder,
} from "discord.js";
import { DiscordMusicBot } from "./discord-bot";

export type SlashCommandCallback = (
	client: DiscordMusicBot,
	interaction: CommandInteraction,
	options: CommandInteractionOptionResolver
) => Promise<any>;

export class SlashCommand extends SlashCommandBuilder {
	type: number;
	execute: Function;
	constructor() {
		super();
		this.type = 1;
		this.execute = () => {};
		return this;
	}

	setExecute(callback: SlashCommandCallback) {
		this.execute = callback;
		return this;
	}
}
