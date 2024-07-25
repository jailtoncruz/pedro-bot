import { CommandInteraction } from "discord.js";
import { DiscordMusicBot } from "../core/interfaces/discord-bot";

export function getChannel(_: DiscordMusicBot, interaction: CommandInteraction) {
    console.log(interaction.member);
    return (interaction.member as any).voice.channel;
}