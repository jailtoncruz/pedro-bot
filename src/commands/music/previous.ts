import { SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../../core/interfaces/discord-command";
import { SlashCommandInteraction } from "../../core/interfaces/slash-command-interaction";

export default {
	data: new SlashCommandBuilder()
		.setName("previous")
		.setDescription("Música anterior"),
	async execute(interaction: SlashCommandInteraction) {
		const kazagumo = interaction.client.kazagumo;
		if (!kazagumo) throw new Error("Kazagumo is undefined.");
		const guildId: string = interaction.guild?.id ?? "";
		let player = kazagumo.getPlayer(guildId);
		if (!player) return await interaction.reply("Bot não conectado.");
		const previous = player.getPrevious();
		if (!previous) return interaction.reply("Música anterior não encontrada.");
		await player.play(player.getPrevious(true));
		return interaction.reply("Reproduzindo musica anterior.");
	},
} as DiscordCommand;
