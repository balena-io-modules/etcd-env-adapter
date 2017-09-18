'use strict';

const _ = require('lodash')
const Promise = require('bluebird')
const express = require('express')
const rp = require('request-promise')

const port = process.env.PORT
const etcdUri = process.env.ETCD_URI

const app = express()

const query = (keys, options = {}) => {
  console.log(options)

  const { prefix, strip } = options

  return Promise.map(keys, key => {
    const [ etcdKey, alias ] = key.split('=')
    const uri = `${etcdUri}/v2/keys/${prefix ? prefix + '/' : ''}${etcdKey}`
    console.log(uri)

    return rp({
      uri: uri,
      method: 'get',
      json:true
    })
    .then(data => {
      return {
        key: etcdKey,
        prefix: prefix,
        value: data.node.value,
        alias: alias
      }
    })
  })
  .tap(console.log)
}

app.get('/', (req, res) => {
  res.send('You have reached an etcd-env-adapter')
})

app.get('/env', (req, res) => {
  const { keys, prefix, strip } = req.query

  query(keys.split(','), {
    prefix: prefix
  })
  .then(data => {
    if (strip) {
      data = _.map(data, result => {
        return _.set(result, 'key', _.drop(result.key.split('/'), strip).join('/'))
      })
    }

    console.log(data)

    res.format({
      'text/plain': () => {
        res.send(_.map(data, ({key, value, alias}) => `${(alias||key).toUpperCase()}=${value}`).join('\n'))
      },
      'application/json': () => {
        res.send(data)
      }
    })
  })
  .catch(err => {
    res.send(err.message)
  })
})

app.listen(port)

