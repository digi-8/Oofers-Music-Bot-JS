const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current song"),
    async execute(interaction) {
        // Get the queue for the server
		const queue = interaction.client.player.getQueue(interaction.guildId)

        // Resumes the current song
		queue.setPaused(false);

        await interaction.reply("Player has been resumed.")
	},
}