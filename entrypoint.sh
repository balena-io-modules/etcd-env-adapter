#!/bin/bash

# Show commands being run, and exit on any command failure
set -ex

# Start etcd in the background
etcd \
  --listen-client-urls="http://0.0.0.0:2379" \
  --advertise-client-urls="http://0.0.0.0:2379" &

sleep 5

etcdctl set foo bar
etcdctl set fizz buzz
etcdctl set woo hoo
etcdctl set /resin/test answer
etcdctl set resin/test answer2

# Start the command in the foreground (`npm start` by default)
exec $@

