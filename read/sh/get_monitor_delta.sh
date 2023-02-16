#!/bin/bash

# BOMB SCRIPT FOR UNDEFINED VAR OR ERR DURING EXECUTION
#set -ue

echo | grep -Fa "$1" "$2" -A 100

#DELTA=$(awk '/2022-12-30\t15:05:31\t0\t00000\t \r/{y=1;next}y' './test_data/Philips/MR/SME01138/monitoring/monitor_magnet_quench.dat')
