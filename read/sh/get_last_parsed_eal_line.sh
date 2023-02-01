#!/bin/bash

# BOMB SCRIPT FOR UNDEFINED VAR OR ERR DURING EXECUTION
set -ue

EAL_LINE_NUM=$( grep -na "/reading] : EALInfo" $1 | cut -d : -f 1 )

let LAST_LINE_NUM=($EAL_LINE_NUM-1)

LAST_LINE=$( grep -na -B 1 "/reading] : EALInfo" $1 | grep -E $LAST_LINE_NUM)

echo $LAST_LINE