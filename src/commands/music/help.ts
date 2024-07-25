import { SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../../core/interfaces/discord-command";
import { SlashCommandInteraction } from "../../core/interfaces/slash-command-interaction";

export default {
	data: new SlashCommandBuilder().setName("help").setDescription("🆘 Ajuda 🆘"),
	async execute(interaction: SlashCommandInteraction) {
		return interaction.reply(
			"🛠️ [WIP] - Comando de ajuda do bot em construção. 🛠️"
		);
	},
} as DiscordCommand;
