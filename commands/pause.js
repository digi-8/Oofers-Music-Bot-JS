const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current song"),
    async execute(interaction) {
        // Get the queue for the server
		const queue = interaction.client.player.getQueue(interaction.guildId)

        // Pauses the current song
		queue.setPaused(true);

        await interaction.reply("Pausing song...")
	},
}