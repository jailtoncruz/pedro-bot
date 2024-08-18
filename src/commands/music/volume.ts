import { SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../../core/interfaces/discord-command";
import { SlashCommandInteraction } from "../../core/interfaces/slash-command-interaction";

export default {
	data: new SlashCommandBuilder()
		.setName("volume")
		.setDescription("Define o volume do player atual.")
		.addIntegerOption((builder) =>
			builder
				.setName("volume")
				.setDescription("Número de 0 a 100.")
				.setRequired(true)
				.setMinValue(0)
				.setMaxValue(100)
		),
	async execute(interaction: SlashCommandInteraction) {
		const kazagumo = interaction.client.kazagumo;
		if (!kazagumo) throw new Error("Kazagumo is undefined.");
		const guildId: string = interaction.guild?.id ?? "";
		let player = kazagumo.getPlayer(guildId);
		if (!player) return await interaction.reply("Bot não conectado.");
		const { value } = interaction.options.get("volume", true) as {
			value?: number;
		};
		if (!value) return await interaction.reply("Digite o volume desejado.");
		player.setVolume(Number(value));
		await interaction.reply(`Volume definido para **${value}**`);
	},
} as DiscordCommand;
