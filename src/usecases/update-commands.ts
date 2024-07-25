import { REST, Routes } from "discord.js";
import { getConfig } from "./get-config";
import { getCommands } from "./get-commands";
import { resolve } from "path";
import { writeFileSync } from "fs";

const { token, clientId } = getConfig();
const rest = new REST().setToken(token);

export async function updateCommands() {
	const commands = getCommands().map((c) => c.data);
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`
		);

		const data: any = await rest.put(Routes.applicationCommands(clientId), {
			body: commands,
		});
		const commandRecordPath = resolve(process.cwd(), "commands.json");
		writeFileSync(
			commandRecordPath,
			JSON.stringify(
				{
					updatedAt: new Date(),
					data,
				},
				null,
				2
			)
		);
		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`
		);
		console.log("Log saved at", commandRecordPath);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
}

updateCommands();
