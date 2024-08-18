import { SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../../core/interfaces/discord-command";
import { SlashCommandInteraction } from "../../core/interfaces/slash-command-interaction";

type LoopStatus = "none" | "queue" | "track";

export default {
	data: new SlashCommandBuilder()
		.setName("loop")
		.setDescription("Habilitar ou desabilitar loop da fila de execução."),
	async execute(interaction: SlashCommandInteraction) {
		const kazagumo = interaction.client.kazagumo;
		if (!kazagumo) throw new Error("Kazagumo is undefined.");
		const guildId: string = interaction.guild?.id ?? "";
		let player = kazagumo.getPlayer(guildId);
		if (!player) return await interaction.reply("Bot não conectado.");

		let newStatus = switchLoopStatus(player.loop);
		player.setLoop(newStatus);
		return interaction.reply(
			`Configuração de loop alternada para **${newStatus}**`
		);
	},
} as DiscordCommand;

function switchLoopStatus(status: LoopStatus): LoopStatus {
	switch (status) {
		case "none":
			return "queue";
		case "queue":
			return "track";
		case "track":
			return "none";
		default:
			return "none";
	}
}
