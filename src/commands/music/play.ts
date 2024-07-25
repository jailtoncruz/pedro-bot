import { SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../../core/interfaces/discord-command";
import { SlashCommandInteraction } from "../../core/interfaces/slash-command-interaction";

export default {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("SOM NA CAIXA")
		.addStringOption((option) =>
			option
				.setName("musica")
				.setDescription(
					"Coloque o nome ou link da musica que desejar ouvir. 😄"
				)
				.setAutocomplete(true)
				.setRequired(true)
		),
	async execute(interaction: SlashCommandInteraction) {
		const kazagumo = interaction.client.kazagumo;
		if (!kazagumo) throw new Error("Kazagumo is undefined.");
		const { value } = interaction.options.get("musica", true) as {
			value?: string;
		};
		if (!value)
			return await interaction.reply(
				"PRECISO DO NOME DA MUSICA PELO MENOS 😭😭😭"
			);
		const voice = (interaction.member as { voice?: any }).voice ?? {};
		const { channel } = voice;
		if (!channel)
			return await interaction.reply(
				"Você precisa estar em um canal de voz para usar este comando."
			);

		const guildId: string = interaction.guild?.id ?? "";
		let player = kazagumo.getPlayer(guildId);

		if (!player) {
			player = await kazagumo.createPlayer({
				guildId,
				textId: interaction.channel?.id ?? "",
				voiceId: channel.id,
				volume: 100,
			});
		}

		let result = await kazagumo.search(value, {
			requester: interaction.member,
		});
		if (!result.tracks.length) return interaction.reply("No results found!");

		if (result.type === "PLAYLIST")
			for (let track of result.tracks) player.queue.add(track);
		else player.queue.add(result.tracks[0]);
		if (!player.playing && !player.paused) player.play();
		return interaction.reply({
			content:
				result.type === "PLAYLIST"
					? `${result.playlistName} - ${result.tracks.length} musicas adicionas a fila de reprodução`
					: `${result.tracks[0].title} adicionada a fila`,
		});
	},
} as DiscordCommand;
