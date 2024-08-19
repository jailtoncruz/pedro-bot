import { SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../../core/interfaces/discord-command";
import {
	SlashCommandInteraction,
	SlashAutocompleteInteraction,
} from "../../core/interfaces/slash-command-interaction";
import { KazagumoTrack } from "kazagumo";
import { getTimeRemaining } from "../../usecases/get-time-remaining";

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
	async autocomplete(interaction: SlashAutocompleteInteraction) {
		const { value } = interaction.options.get("musica", true) as {
			value?: string;
		};
		const kazagumo = interaction.client.kazagumo;
		if (!kazagumo) throw new Error("Kazagumo is undefined.");
		if (!value) return;
		let result = await kazagumo.search(value, {
			requester: interaction.member,
		});
		interaction.respond(
			result.tracks.slice(0, 5).map((track: KazagumoTrack) => ({
				name: track.title,
				value: track.title,
			}))
		);
	},
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
		const queueTimeRemaining = getTimeRemaining(player);
		return interaction.reply({
			content:
				result.type === "PLAYLIST"
					? `Playlist **${result.playlistName}** com **${result.tracks.length}** músicas adicionas a lista de reprodução.\n**${queueTimeRemaining}**`
					: `${result.tracks[0].title} adicionada a fila`,
		});
	},
} as DiscordCommand;
