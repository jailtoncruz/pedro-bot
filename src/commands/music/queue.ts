import { SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../../core/interfaces/discord-command";
import { SlashCommandInteraction } from "../../core/interfaces/slash-command-interaction";

export default {
	data: new SlashCommandBuilder()
		.setName("queue")
		.setDescription("Exibe musicas na fila de reprodução")
		.addStringOption((option) =>
			option
				.setName("page")
				.setDescription("Página da lista")
				.setAutocomplete(false)
				.setRequired(false)
		),
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

		const pageOption = interaction.options.get("page", false) as {
			value?: string;
		};

		const SONGS_PER_PAGE = 20;
		const PAGE = pageOption?.value ? Number(pageOption.value) - 1 : 0;
		const songsOnPage = player.queue.slice(
			PAGE * SONGS_PER_PAGE,
			(PAGE + 1) * SONGS_PER_PAGE
		);
		baseMsg = baseMsg.concat(
			songsOnPage
				.map(
					(song, index) =>
						`**${PAGE * SONGS_PER_PAGE + index + 1}** - **${
							song.title
						}** de **${song.author}**`
				)
				.join("\n")
				.concat(
					`\n\n**Página ${PAGE + 1} de ${Math.ceil(
						player.queue.length / SONGS_PER_PAGE
					)}**`
				)
		);

		return interaction.reply(baseMsg);
	},
} as DiscordCommand;
