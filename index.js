const dotenv = require('dotenv')
dotenv.config()

const { Client, Intents } = require('discord.js')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice')
const ytdl = require('ytdl-core')

const client = new Client({
  shards: 'auto',
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ]
})

client.login(process.env.TOKEN)
const channel = process.env.CHANNEL_ID

client.on('ready', async () => {
  joinChannel(channel)
})

function joinChannel(channel) {
  client.channels.fetch(channel).then(c => {

    // setup voice connection
    const voiceConnection = joinVoiceChannel({
      channelId: c.id,
      guildId: c.guild.id,
      adapterCreator: c.guild.voiceAdapterCreator
    })
    // loadResource wip: push music to queue
    const resource = loadResource('https://www.youtube.com/watch?v=PmczC8sXPbs')
    resource.volume.setVolume(1)

    // create player audio
    const player = createAudioPlayer()
    voiceConnection.subscribe(player)
    
    // play and have fun
    player.play(resource)

    player.on(AudioPlayerStatus.Idle, () => {
      try {
        player.stop()
        voiceConnection.destroy()
      } catch (e) {
        console.log(e)
      }
    })

  })
}

function loadResource(youtubeURL) {
  const resource = createAudioResource(ytdl(youtubeURL), { inlineVolume: true })
  return resource
}
