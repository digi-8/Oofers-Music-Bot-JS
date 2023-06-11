const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders")
const { useMasterPlayer } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song"),
    async execute(interaction) {
        // Get the queue for the server
		const player = useMasterPlayer();
        const queue = player.nodes.get(interaction.guildId)

        // If there is no queue, return
		if (!queue)
        {
            await interaction.reply({ content: 'There is no songs in queue', ephemeral: true });
            return;
        }

        const currentSong = queue.current

        // Skip the current song
		queue.node.skip();

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