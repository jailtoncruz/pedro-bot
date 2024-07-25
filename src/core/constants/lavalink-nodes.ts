export const LavalinkNodes = [
	{
		name: process.env.LAVALINK_NAME ?? "main",
		url: process.env.LAVALINK_URL ?? "localhost:2333",
		auth: process.env.LAVALINK_PASSWORD ?? "youshallnotpass",
		secure: process.env.LAVALINK_SECURE === "true",
	},
	// {
	// 	name: "rocks",
	// 	url: "ssl.lavalink.rocks:443",
	// 	auth: "horizxon.tech",
	// 	secure: true,
	// },
	// {
	// 	name: "lavalink",
	// 	url: "buses.sleepyinsomniac.eu.org",
	// 	auth: "youshallnotpass",
	// 	secure: false,
	// },
];
