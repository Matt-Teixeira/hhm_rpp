#!/bin/bash

# BOMB SCRIPT FOR UNDEFINED VAR OR ERR DURING EXECUTION
set -ue

EAL_LINE_NUM=$( grep -F -na "[/reading] : Events" $1 | cut -d : -f 1 )

let LAST_LINE_NUM=($EAL_LINE_NUM-1)

LAST_LINE=$( grep -F -na -B 3 "[/reading] : Events" $1 | grep -F $LAST_LINE_NUM)

echo $LAST_LINE