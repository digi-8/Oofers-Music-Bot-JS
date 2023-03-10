const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Displays the first 10 song in queue"),
    async execute(interaction) {
        const queue = interaction.client.player.getQueue(interaction.guildId)

        // Checks if there are songs in the queue
        if (!queue || !queue.playing)
        {
            await interaction.reply({ content: 'There is no songs in queue', ephemeral: true });
            return;
        }

        // Get the first 10 songs in the queue
        const queueString = queue.tracks.slice(0, 10).map((song, i) => {
            return `${i}) [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`
        }).join("\n")

        // Get the current song
        const currentSong = queue.current

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Currently Playing**\n` + 
                        (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None") +
                        `\n\n**Queue**\n${queueString}`
                    )
                    .setThumbnail(currentSong.setThumbnail)
            ]
        })
}
}