import {
	Client,
	ClientOptions,
	Collection,
	Events,
	GatewayIntentBits,
} from "discord.js";
import { BotConfig } from "./bot-config";
import { getConfig } from "../../usecases/get-config";
import { getCommands } from "../../usecases/get-commands";
import { DiscordCommand } from "./discord-command";
import { Kazagumo } from "kazagumo";
import { createKazagumo } from "../../usecases/create-kazagumo";

export class DiscordMusicBot<
	Ready extends boolean = boolean
> extends Client<Ready> {
	config: BotConfig;
	commands: Collection<string, DiscordCommand>;
	kazagumo: Kazagumo | undefined;
	constructor(
		props: ClientOptions = {
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildVoiceStates,
				GatewayIntentBits.GuildMessages,
			],
		}
	) {
		super(props);
		this.config = getConfig();
		this.commands = getCommands();
		this.kazagumo = createKazagumo(this);
		this.onInit();
	}

	onInit() {
		this.on("ready", () => console.log(this.user?.tag + " Ready!"));
		this.on("messageCreate", async (msg) => {
			if (msg.author.bot) return;

			if (msg.content.startsWith("!play")) {
				return msg.reply("Por favor, utilize /play 😉");
			}
		});
		this.on(Events.InteractionCreate, async (interaction) => {
			const _client: DiscordMusicBot = interaction.client as DiscordMusicBot;
			if (interaction.isAutocomplete()) {
				const command = _client.commands.get(interaction.commandName);
				if (command && command.autocomplete)
					await command.autocomplete(interaction);
				return;
			}
			if (interaction.isChatInputCommand()) {
				const command = _client.commands.get(interaction.commandName);

				if (!command) {
					console.error(
						`No command matching ${interaction.commandName} was found.`
					);
					return;
				}

				try {
					await command.execute(interaction);
				} catch (error) {
					console.error(error);
					if (interaction.replied || interaction.deferred) {
						await interaction.followUp({
							content: "There was an error while executing this command!",
							ephemeral: true,
						});
					} else {
						await interaction.reply({
							content: "There was an error while executing this command!",
							ephemeral: true,
						});
					}
				}
			}
		});
		return this;
	}
}
