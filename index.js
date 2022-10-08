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
let queue = []

client.on('ready', async () => {
  console.log('ready')
})

client.on('messageCreate', msg => {
  if (msg.author.id === client.user.id || msg.author.bot) return
  const args = msg.content.trim().split(' ')[0]

  switch (args) {
    case `${perfix}p`: playMusic(msg)
      // if (queue.length() === 0) {
      //   playMusic(msg)
      //   removeQueue()
      // } else {
      //   addQueue(msg)
      // }
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


    const URL = getQueue()
    let resource
    if (URL) {
      resource = loadResourceMusic(URL)
      resource.volume.setVolume(1)
      voiceInstance.subscribe(player)
      player.play(resource)
      removeQueue()
    } else {
      addQueue(msg.content)
    }

    player.on(AudioPlayerStatus.Idle, () => {
      console.log('Idle')
      const URL = getQueue()
      if (URL) {
        console.log('continue...')
        resource = loadResourceMusic(URL)
        resource.volume.setVolume(1)
        player.play(resource)
      } else {
        console.log('destory...')
        player.stop()
        voiceInstance.destroy()
      }
    })


    // handle events music
    // handleEventMusic(player, voiceInstance)

    // TODO:
    // msg.channel.send("pong!")
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
    try {
      player.stop()
      voiceInstance.destroy()
    } catch(err) {
      player.stop()
      console.log('Error Hutao :', err)
    }

  })
}

const getQueue = () => {
  return queue[0]
}

const removeQueue = () => {
  queue.shift()
}

const addQueue = (query) => {
  // TODO: query youtube
  const youtubeURL = getYoutubeURL(query)
  queue.push(youtubeURL)
}

const getYoutubeURL = (query) => {
  return 'https://www.youtube.com/watch?v=hazLhv9bRNA'
}
