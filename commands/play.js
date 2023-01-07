const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play a song from YouTube.")
		.addSubcommand(subcommand =>
			subcommand
				.setName("search")
				.setDescription("Searches for a song and plays it")
				.addStringOption(option =>
					option.setName("ytsearch").setDescription("Search keywords").setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("url")
				.setDescription("Plays a song from YT URL")
				.addStringOption(option => 
                    option.setName("url").setDescription("The song's url").setRequired(true)
                )
		),
    async execute(interaction) {

        if (!interaction.member.voice.channel) return interaction.reply({ content: 'You are not in a voice channel', ephemeral: true});

        const queue = await interaction.client.player.createQueue(interaction.guild);

        if (!queue.connection) await queue.connect(interaction.member.voice.channel);		
        
        const embed = new EmbedBuilder();
		if (interaction.options.getSubcommand() === "url") {
            let url = interaction.options.getString("url")
            
            // Search for the song using the discord-player
            const result = await interaction.client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })

            // finish if no tracks were found
            if (result.tracks.length === 0)
                return interaction.reply({ content: 'Link not working, try another', ephemeral: true})

            // Add the track to the queue
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})


		} else if (interaction.options.getSubcommand() === "search") {
            let url = interaction.options.getString("searchterms")
            
            // Search for the song using the discord-player
            const result = await interaction.client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            // finish if no tracks were found
            if (result.tracks.length === 0)
                return interaction.reply({ content: 'No results found', ephemeral: true})

            // Add the track to the queue
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})

		}

        if (!queue.playing) await queue.play();

        await interaction.reply({
            embeds: [embed]
        })

    }
}
