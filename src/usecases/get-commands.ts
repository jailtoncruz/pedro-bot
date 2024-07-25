import { readdirSync } from "fs";
import { join } from "path";
import { DiscordCommand } from "../core/interfaces/discord-command";
import { Collection } from "discord.js";

export function getCommands(): Collection<string, DiscordCommand> {
	const foldersPath = join(__dirname, "..", "commands");
	const commandFolders = readdirSync(foldersPath);
	const commands = new Collection<string, DiscordCommand>();

	for (const folder of commandFolders) {
		const commandsPath = join(foldersPath, folder);
		const commandFiles = readdirSync(commandsPath).filter(
			(file) => file.endsWith(".js") || file.endsWith(".ts")
		);
		for (const file of commandFiles) {
			const filePath = join(commandsPath, file);
			const command = require(filePath).default as DiscordCommand;
			try {
				if ("data" in command && "execute" in command) {
					commands.set(command.data.name, command);
				} else {
					console.log(
						`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
					);
				}
			} catch (_err) {
				console.error(_err, command, file, filePath);
			}
		}
	}
	return commands;
}
