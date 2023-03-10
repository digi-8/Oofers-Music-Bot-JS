const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play a song from YouTube.")
		.addSubcommand(subcommand =>
			subcommand
				.setName("search")
				.setDescription("Searches for a song and plays the first result")
				.addStringOption(option =>
					option.setName("ytsearch").setDescription("Search keywords").setRequired(true)
				)
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName("url")
				.setDescription("Plays a song from Youtube URL")
				.addStringOption(option => 
                    option.setName("url").setDescription("The song's URL").setRequired(true)
                )
		)
        .addSubcommand(subcommand =>
			subcommand
				.setName("playlist")
				.setDescription("Plays a playlist from Youtube URL")
				.addStringOption(option =>
                    option.setName("url").setDescription("The playlist's URL").setRequired(true)
                )
		),
    async execute(interaction) {
        // Checks if user sending message is in a voice channel
        if (!interaction.member.voice.channel) return interaction.reply({ content: 'You are not in a voice channel', ephemeral: true});

        const queue = await interaction.client.player.createQueue(interaction.guild);

        // If the bot is not connected, connect to the users channel
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);		

        // Buttons for media control
        const controls = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('pp')
                    .setLabel(':play_pause:')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('skip')
                    .setLabel(':track_next:')
                    .setStyle(ButtonStyle.Secondary),
            );

        // const collector = interaction.channel.createMessageComponentCollector({ componentType: ComponentType.Button, time: 180000 });
        // collector.on('collect', async i => {
        //     if (i.customId === 'pp') {
        //         if (!queue.playing) {
        //             await command.execute("./resume.js");
        //         } else if (queue.playing) {
        //             await command.execute("./pause.js");
        //         }
        //     }
        //     if (i.customId === 'Split') {
        //         await i.reply({ content: 'This is Split', ephemeral: true });
        //     }
        // });
        // collector.on('end', collected => {
        //     console.log(`Collected ${collected.size} interactions.`);
        // });
        
        const embed = new EmbedBuilder();
		if (interaction.options.getSubcommand() === "url") {
            let url = interaction.options.getString("url")
            
            // Check if URL is a yt video using the discord-player
            const result = await interaction.client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })

            // Return if there was no results
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
            let url = interaction.options.getString("ytsearch")
            
            // Search for the song using the discord-player
            const result = await interaction.client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            // Return if there was no results
            if (result.tracks.length === 0)
                return interaction.reply({ content: 'No results found', ephemeral: true})

            // Add the track to the queue
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})

		} else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")

            // Search for the playlist using the discord-player
            const result = await interaction.client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })

            // Return if there was no results
            if (result.tracks.length === 0)
                return interaction.reply(`No playlists found with ${url}`)
            
            // Add all the videos to the queue
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`)
                .setThumbnail(playlist.thumbnail)
        }

        // If the bot is not plaing, play next song
        if (!queue.playing) await queue.play();

        // Sends a message with correct embed
        await interaction.reply({
            embeds: [embed]
        })

    }
}
