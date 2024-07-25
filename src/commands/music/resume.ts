import { SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../../core/interfaces/discord-command";
import { SlashCommandInteraction } from "../../core/interfaces/slash-command-interaction";

export default {
	data: new SlashCommandBuilder()
		.setName("resume")
		.setDescription("Continuar reprodução. (Quando pausado)"),
	async execute(interaction: SlashCommandInteraction) {
		const kazagumo = interaction.client.kazagumo;
		if (!kazagumo) throw new Error("Kazagumo is undefined.");
		const guildId: string = interaction.guild?.id ?? "";
		let player = kazagumo.getPlayer(guildId);
		if (!player) return await interaction.reply("Bot não conectado.");
		const current = player.queue.current;
		if (player.paused && current) {
			player.pause(false);
			return interaction.reply(
				`Tocando **${current.title}** de **${current.author}**`
			);
		} else return interaction.reply("Bot não está pausado.");
	},
} as DiscordCommand;
