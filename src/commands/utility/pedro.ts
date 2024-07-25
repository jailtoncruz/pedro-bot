import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { DiscordCommand } from "../../core/interfaces/discord-command";

export default {
	data: new SlashCommandBuilder()
		.setName("pedro")
		.setDescription("Responde com PEDRO!"),
	async execute(interaction: CommandInteraction) {
		await interaction.reply("PEDRO!");
	},
} as DiscordCommand;
