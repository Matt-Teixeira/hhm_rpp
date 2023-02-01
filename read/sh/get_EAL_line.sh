#!/bin/bash

# BOMB SCRIPT FOR UNDEFINED VAR OR ERR DURING EXECUTION
set -ue

EAL_LINE_NUM=$( grep -na "/reading] : EALInfo" $1 | cut -d : -f 1 )

LAST_PARSE_LINE_NUM=$(grep -na "$2" $1 | cut -d : -f 1)

# num is the line number diff between end of capture block and last parsed line
# -1 from result to exclude last parsed line
let num=($EAL_LINE_NUM-$LAST_PARSE_LINE_NUM-1)

FILE_DELTA=$(grep -a -B $num "/reading] : EALInfo" $1)

echo $FILE_DELTA
