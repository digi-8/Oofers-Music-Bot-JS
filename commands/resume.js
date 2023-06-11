const { SlashCommandBuilder } = require("@discordjs/builders")
const { useMasterPlayer } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes playing the paused song"),
    async execute(interaction) {
        // Get the queue for the server
		const player = useMasterPlayer();
        const queue = player.nodes.get(interaction.guildId)

        // Resumes the current song
		queue.node.resume();

        await interaction.reply("Resuming song...")
	},
}