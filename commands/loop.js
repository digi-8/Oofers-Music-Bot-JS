const { SlashCommandBuilder } = require("@discordjs/builders");
const { QueueRepeatMode } = require('discord-player');

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
		const queue = interaction.client.player.getQueue(interaction.guildId)
        const loopopt = interaction.options.getString('looping');
        if (loopopt === 'song') {
            if (!queue)
            {
                await interaction.reply({ content: 'There is no songs in queue', ephemeral: true });
                return;
            }
            const success = queue.setRepeatMode( QueueRepeatMode.TRACK);
            await interaction.reply('Looping Song: Enabled');

        } else if (loopopt === 'queue') {

            if (!queue)
            {
                await interaction.reply({ content: 'There is no songs in queue', ephemeral: true });
                return;
            }
            const success = queue.setRepeatMode( QueueRepeatMode.QUEUE);

            await interaction.reply('Looping Queue: Enabled');

        } else if (loopopt === 'disable') {

            const success = queue.setRepeatMode(QueueRepeatMode.OFF);
            await interaction.reply('Looping: Disabled');

        }
    },
}