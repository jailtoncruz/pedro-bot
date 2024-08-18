import { Kazagumo } from "kazagumo";
import { DiscordMusicBot } from "../core/interfaces/discord-bot";
import { Connectors } from "shoukaku";
import { LavalinkNodes } from "../core/constants/lavalink-nodes";
import Spotify from "kazagumo-spotify";
import AppleMusic from "kazagumo-apple";
import KazagumoFilter from "kazagumo-filter";

export function createKazagumo(client: DiscordMusicBot) {
	const kazagumo = new Kazagumo(
		{
			defaultSearchEngine: "youtube",
			// MAKE SURE YOU HAVE THIS
			send: (guildId, payload) => {
				const guild = client.guilds.cache.get(guildId);
				if (guild) guild.shard.send(payload);
			},
			plugins: [
				new Spotify({
					clientId: client.config.spotifyClientId,
					clientSecret: client.config.spotifyClientSecret,
					searchMarket: "BR", // optional || default: US ( Enter the country you live in. [ Can only be of 2 letters. For eg: US, IN, EN ] )//
				}),
				new AppleMusic({}),
				new KazagumoFilter(),
			],
		},
		new Connectors.DiscordJS(client),
		LavalinkNodes
	);

	kazagumo.shoukaku.on("ready", (name) =>
		console.log(`Lavalink ${name}: Ready!`)
	);
	kazagumo.shoukaku.on("error", (name, error) =>
		console.error(`Lavalink ${name}: Error Caught,`, error)
	);
	kazagumo.shoukaku.on("close", (name, code, reason) =>
		console.warn(
			`Lavalink ${name}: Closed, Code ${code}, Reason ${reason || "No reason"}`
		)
	);
	kazagumo.shoukaku.on("debug", (name, info) =>
		console.debug(`Lavalink ${name}: Debug,`, info)
	);
	kazagumo.shoukaku.on("disconnect", (name, count) => {
		const players = [...kazagumo.shoukaku.players.values()].filter(
			(p) => p.node.name === name
		);
		players.map((player) => {
			kazagumo.destroyPlayer(player.guildId);
			player.destroy();
		});
		console.warn(`Lavalink ${name}: Disconnected`);
	});
	kazagumo.on("playerStart", (player, track) => {
		const cachedChannel = client.channels.cache.get(player.textId ?? "") as any;
		cachedChannel
			.send({
				content: `Reproduzindo **${track.title}** de **${track.author}**`,
			})
			.then((x: any) => player.data.set("message", x));
	});
	kazagumo.on("playerEnd", (player) => {
		if (player.queue.length === 0)
			player.data.get("message")?.edit({ content: `Fila vazia` });
	});
	let timeoutToDisconect: NodeJS.Timeout | undefined = undefined;
	kazagumo.on("playerEmpty", (player) => {
		if (timeoutToDisconect) clearTimeout(timeoutToDisconect);
		timeoutToDisconect = setTimeout(() => {
			if (!player.playing) {
				const cachedChannel = client.channels.cache.get(
					player.textId ?? ""
				) as any;
				cachedChannel
					.send({ content: `Bot desconectado por inatividade.` })
					.then((x: any) => player.data.set("message", x));
				player.destroy();
			}
		}, 1000 * 30); // 30s
	});

	return kazagumo;
}
