const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song"),
    async execute(interaction) {
        // Get the queue for the server
		const queue = interaction.client.player.getQueue(interaction.guildId)

        // If there is no queue, return
		if (!queue)
        {
            await interaction.reply({ content: 'There is no songs in queue', ephemeral: true });
            return;
        }

        const currentSong = queue.current

        // Skip the current song
		queue.skip()

        // Return an embed to the user saying the song has been skipped
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**[${currentSong.title}](${currentSong.url})** has been skipped!`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
	},
}