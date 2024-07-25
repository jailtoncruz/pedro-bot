import { Kazagumo } from "kazagumo";
import { DiscordMusicBot } from "../core/interfaces/discord-bot";
import { Connectors } from "shoukaku";
import { LavalinkNodes } from "../core/constants/lavalink-nodes";

export function createKazagumo(client: DiscordMusicBot) {
	const kazagumo = new Kazagumo(
		{
			defaultSearchEngine: "youtube",
			// MAKE SURE YOU HAVE THIS
			send: (guildId, payload) => {
				const guild = client.guilds.cache.get(guildId);
				if (guild) guild.shard.send(payload);
			},
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
		player.data.get("message")?.edit({ content: `Fila vazia` });
	});
	kazagumo.on("playerEmpty", (player) => {
		const cachedChannel = client.channels.cache.get(player.textId ?? "") as any;
		cachedChannel
			.send({ content: `Bot desconectado por inatividade.` })
			.then((x: any) => player.data.set("message", x));
		console.log(new Date(), "playerEmpty");
		setTimeout(() => {
			console.log(new Date(), "playerEmpty after 5s");
			player.destroy();
		}, 1000 * 5);
	});

	return kazagumo;
}
