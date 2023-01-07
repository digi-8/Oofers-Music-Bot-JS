const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnects the bot from the channel and clears queue."),
    async execute(interaction) {

        // Get the current queue
		const queue = interaction.client.player.getQueue(interaction.guildId)

        // Deletes all the songs from the queue and exits the channel
		queue.destroy();

        await interaction.reply({ content: 'Goodbye <a:CryingManGif:869960122200383538>', ephemeral: true})
	},
}