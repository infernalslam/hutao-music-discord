const dotenv = require('dotenv')
const { Client, Intents } = require('discord.js')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus  } = require('@discordjs/voice')
const ytdl = require('ytdl-core')
const { must } = require('./util/must')

dotenv.config()
const channelId = process.env.CHANNEL_ID

const createConnection = async (client, channelId) => {
  const [conn, err] =  await must(client.channels.fetch(channelId))
  if (err!==null) {
    console.error('Cannot fetch channel ', err)
    return null
  }

  return conn
}

const loadResource = (youtubeURL) => {
  const resource = createAudioResource(ytdl(youtubeURL), { inlineVolume: true })
  return resource
}

const playYoutubeMusic = (voiceConnection, player, url) => {
    //TODO: loadResource wip: push music to queue
    const resource = loadResource(url)
    resource.volume.setVolume(1)

    voiceConnection.subscribe(player)    
    // play and have fun
    player.play(resource)

    player.on(AudioPlayerStatus.Idle, () => {
      try {
        if(player) player.stop()
        if(voiceConnection
          && voiceConnection.state!==VoiceConnectionStatus.Destroyed
          ) voiceConnection.destroy()
      } catch (e) {
        console.log('error', e)
      }
    })

}

const stopMusic = (voiceConnection, player) => {
  if(player) player.stop()
  if(voiceConnection
    && voiceConnection.state!==VoiceConnectionStatus.Destroyed
    ) voiceConnection.destroy()
}

const onMesssageCreate = (conn, voiceConnection, player, msg)=>{
  if(msg.author.bot) return
  const { content } = msg
  const command = content.split(' ')[0]
  const arg = content.split(' ').slice(1, content.length)

  switch (command){
    case '.play':
      const url = arg.join('')
       // setup voice connection
       if(voiceConnection==null){
        voiceConnection = joinVoiceChannel({
          channelId: conn.id,
          guildId: conn.guild.id,
          adapterCreator: conn.guild.voiceAdapterCreator
        })
       }
      playYoutubeMusic(voiceConnection, player, url)
      break
    case '.stop':  
      stopMusic(voiceConnection, player)
      break
  }
}

// run bot
const main = async () => {
  const client = new Client({
    shards: 'auto',
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ]
  })
  
  await client.login(process.env.TOKEN)
  const conn = await createConnection(client, channelId)
  if(conn==null){
    return
  }

   // setup voice connection
   let voiceConnection = null

  // create player audio
  const player = createAudioPlayer()

  client.on('ready', async () => {
  })
  
  client.on('messageCreate', (msg)=>{onMesssageCreate(conn, voiceConnection, player,msg)})
}
main()