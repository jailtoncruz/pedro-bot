import { SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../../core/interfaces/discord-command";
import { SlashCommandInteraction } from "../../core/interfaces/slash-command-interaction";

export default {
	data: new SlashCommandBuilder()
		.setName("pause")
		.setDescription("Pausar música atual"),
	async execute(interaction: SlashCommandInteraction) {
		const kazagumo = interaction.client.kazagumo;
		if (!kazagumo) throw new Error("Kazagumo is undefined.");
		const guildId: string = interaction.guild?.id ?? "";
		let player = kazagumo.getPlayer(guildId);
		if (!player) return await interaction.reply("Bot não conectado.");
		player.pause(true);
		return interaction.reply("Fila de reprodução pausada.");
	},
} as DiscordCommand;
