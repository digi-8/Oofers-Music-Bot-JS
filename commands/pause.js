const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMasterPlayer } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current song"),
    async execute(interaction) {
        // Get the queue for the server
		const player = useMasterPlayer();
        const queue = player.nodes.get(interaction.guildId)

        // Pauses the current song
		queue.node.pause();

        await interaction.reply("Pausing song...")
	},
}