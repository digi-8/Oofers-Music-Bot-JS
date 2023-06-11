const { SlashCommandBuilder } = require("@discordjs/builders");
const { useMasterPlayer, useQueue } = require("discord-player");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("loop")
        .setDescription("Enable or disable looping of a song or the whole queue")
        .addStringOption(option =>
            option.setName('looping')
                .setDescription('Select Looping')
                .setRequired(true)
                .addChoices(
                    { name: 'Song', value: 'song' },
                    { name: 'Queue', value: 'queue' },
                    { name: 'Disable', value: 'disable' },
                )),
    async execute(interaction) {
		const player = useMasterPlayer();
		const queue = player.nodes.get(interaction.guildId)
        const loopopt = interaction.options.getString('looping');
        if (loopopt === 'song') {
            // Checks if there are songs in queue
            if (!queue)
            {
                await interaction.reply({ content: 'There is no songs in queue', ephemeral: true });
                return;
            }

            // Sets repeat to current song 
            const success = queue.setRepeatMode(Track);
            await interaction.reply('Looping Song: Enabled');

        } else if (loopopt === 'queue') {
            // Checks if there are songs in queue
            if (!queue)
            {
                await interaction.reply({ content: 'There is no songs in queue', ephemeral: true });
                return;
            }

            // Sets repeat to the entire queue
            const success = queue.setRepeatMode(Queue);
            await interaction.reply('Looping Queue: Enabled');

        } else if (loopopt === 'disable') {
            // Disables repeating
            const success = queue.setRepeatMode(Off);
            await interaction.reply('Looping: Disabled');

        }
    },
}