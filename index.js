const dotenv = require('dotenv')
dotenv.config()

const { Client, Intents } = require('discord.js')
const { joinVoiceChannel, 
        createAudioPlayer, 
        createAudioResource,
        AudioPlayerStatus
      } = require('@discordjs/voice')
const ytdl = require('ytdl-core')

const client = new Client({
  shards: 'auto',
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ]
})

const player = createAudioPlayer()

const perfix = `-`

client.login(process.env.TOKEN)


const channelID = process.env.CHANNEL_ID

client.on('ready', async () => {
  console.log('ready')
})

client.on('messageCreate', msg => {
  if (msg.author.id === client.user.id || msg.author.bot) return
  const args = msg.content.trim().split(' ')[0]

  switch (args) {
    case `${perfix}p`: playMusic(msg)
    case `${perfix}s`: break
    case `${perfix}e`: break
  }

})

const playMusic = (msg) => {
  voiceConnection(msg)
}

const voiceConnection = (msg) => {
  client.channels.fetch(channelID).then(c => {

    const confJoinVoice = {
      channelId: c.id,
      guildId: c.guild.id,
      adapterCreator: c.guild.voiceAdapterCreator
    }

    const voiceInstance = joinVoiceChannel(confJoinVoice)


    const resource = loadResourceMusic('https://www.youtube.com/watch?v=HYsz1hP0BFo')
    resource.volume.setVolume(1)
    

    // const player = createAudioPlayer()
    voiceInstance.subscribe(player)
    player.play(resource)


    // handle events music
    handleEventMusic(player, voiceInstance)

    // TODO:
    msg.channel.send("pong!")
  })
}

const loadResourceMusic = (youtubeURL) => {
  if (!ytdl.validateURL(youtubeURL)) {
    console.log('ytdl validate url')
  }

  return createAudioResource(ytdl(youtubeURL, { filter: 'audioonly' }), { inlineVolume: true })
}

const handleEventMusic = (player, voiceInstance) => {
  player.on(AudioPlayerStatus.Playing, () => {
    console.log('Playing')
  })

  player.on(AudioPlayerStatus.Idle, () => {
    console.log('Idel')
  })
  // player.on(AudioPlayerStatus.Idle, () => {
  //   console.log('hahahah')
  //   try {
  //     player.stop()
  //     voiceInstance.destroy()
  //   } catch(err) {
  //     player.stop()
  //     console.log('Error Hutao :', err)
  //   }

  // })
}
