import { SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../../core/interfaces/discord-command";
import { SlashCommandInteraction } from "../../core/interfaces/slash-command-interaction";

export default {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Exibe musicas na fila de reprodução"),
	async execute(interaction: SlashCommandInteraction) {
		const kazagumo = interaction.client.kazagumo;
		if (!kazagumo) throw new Error("Kazagumo is undefined.");
		const guildId: string = interaction.guild?.id ?? "";
		let player = kazagumo.getPlayer(guildId);
		if (!player) return await interaction.reply("Bot não conectado.");
		const current = player.queue.current;
		let baseMsg = "**Lista de reprodução**\n\n";
		if (current) {
			baseMsg = baseMsg.concat(
				`(Atual) - **${current.title}** de **${current.author}**\n`
			);
		}
		baseMsg = baseMsg.concat(
			player.queue
				.map(
					(song, index) =>
						`**${index + 1}** - **${song.title}** de **${song.author}**`
				)
				.join("\n")
		);

		return interaction.reply(baseMsg);
	},
} as DiscordCommand;
