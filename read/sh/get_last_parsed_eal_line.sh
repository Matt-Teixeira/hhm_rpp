#!/bin/bash

# BOMB SCRIPT FOR UNDEFINED VAR OR ERR DURING EXECUTION
set -ue

# Get line numer of end capture block
EAL_LINE_NUM=$( grep -F -na "[/reading] : EALInfo" $1 | cut -d : -f 1 )

# Get line number just above end capture block
let LAST_LINE_NUM=($EAL_LINE_NUM-1)

# Pass LAST_LINE_NUM as arg to grep just that line to then clean up for redis
LAST_LINE=$( grep -F -na -B 1 "[/reading] : EALInfo" $1 | grep -E $LAST_LINE_NUM)

echo $LAST_LINE