#!/bin/bash

# BOMB SCRIPT FOR UNDEFINED VAR OR ERR DURING EXECUTION
set -ue

EAL_LINE_NUM=$(grep -na "/reading] : EALInfo" $1 | cut -d : -f 1)

# Will be true if file is empty. BAIL OUT!!!
if [ -z "$EAL_LINE_NUM" ]; then 
    echo false
    exit
fi

LAST_PARSE_LINE_NUM=$(grep -F -na "$2" $1 | cut -d : -f 1)

# Ff LAST_PARSE_LINE_NUM is null (redis returns null for no key - new system) place a line offset of 1
# Otherwise, offset will be line number of last line parsed minus that line.
if [ -z "$LAST_PARSE_LINE_NUM" ]; then
    let num=($EAL_LINE_NUM - 1)

    FILE_DELTA=$(grep -a -B $num "/reading] : EALInfo" $1)

    echo $FILE_DELTA
elif [[ $(($EAL_LINE_NUM - $LAST_PARSE_LINE_NUM)) -eq 1 ]]; then
    echo false
else
    # num is the line number diff between end of capture block and last parsed line
    # -1 from result to exclude last parsed line
    let num=($EAL_LINE_NUM - $LAST_PARSE_LINE_NUM - 1)

    FILE_DELTA=$(grep -a -B $num "/reading] : EALInfo" $1)

    echo $FILE_DELTA
fi
