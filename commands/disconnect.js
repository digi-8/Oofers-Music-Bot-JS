const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMasterPlayer } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("disconnect")
        .setDescription("Disconnects the bot from the channel and clears queue."),
    async execute(interaction) {

        const player = useMasterPlayer();
        // Get the current queue
		const queue = player.nodes.get(interaction.guildId)

        // Deletes all the songs from the queue and exits the channel
		queue.delete();

        await interaction.reply({ content: 'Goodbye <a:CryingManGif:869960122200383538>' })
	},
}