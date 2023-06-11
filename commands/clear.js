const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMasterPlayer } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Clears the queue."),
    async execute(interaction) {

        const player = useMasterPlayer();
		const queue = player.nodes.get(interaction.guildId)

        // Clears all songs
		queue.tracks.clear();

        await interaction.reply({ content: 'All songs cleared', ephemeral: true })
	},
}