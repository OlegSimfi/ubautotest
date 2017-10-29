#!/usr/bin/env %UB_HOME%\ub

const fs = require('fs')
const path = require('path')
// argv: executable ubcli command ...params
const command = process.argv[2]

// commands help
if (!command || (['-?', '/?', '-help', '/help'].indexOf(command) !== -1)) {
  let commands = fs.readdirSync(path.join(__dirname, '..', 'lib'))
  console.info('Possible commands:')
  for (let cmd of commands) {
    if (cmd.endsWith('.js')) {
      console.log('\t', cmd.replace(/\.js$/, ''))
    }
  }
  console.log('\r\nRun ubcli commandName -? for a command help')
} else {
  const cmdModule = require(`../lib/${command}`)
  if (typeof cmdModule === 'function') cmdModule()
}

