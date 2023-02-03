#!/bin/bash

# BOMB SCRIPT FOR UNDEFINED VAR OR ERR DURING EXECUTION
set -ue

# Could get null from redis line if non-existent key in redis (new file/system)
if [ "null" == "$2" ]; then # Get all blocked Event data

    EVENTS_BEGINNING__LINE_NUM=$(grep -F -na "[reading] : Events" $1 | cut -d : -f 1)

    # Will resolve to "true" if file is empty. BAIL OUT!!!
    if [ -z "$EVENTS_BEGINNING__LINE_NUM" ]; then
        echo false
        exit
    fi
    EVENTS_ENDING_LINE_NUM=$(grep -F -na "[/reading] : Events" $1 | cut -d : -f 1)

    let LINE_DELTA=($EVENTS_ENDING_LINE_NUM - $EVENTS_BEGINNING__LINE_NUM)

    FILE_DATA=$(grep -Fa -B "$LINE_DELTA" "[/reading] : Events" $1)

    echo $FILE_DATA

else
    EVENTS_BEGINNING__LINE_NUM=$(grep -F -na "$2" $1 | cut -d : -f 1)
    EVENTS_ENDING_LINE_NUM=$(grep -F -na "[/reading] : Events" $1 | cut -d : -f 1)

    # Check if EVENTS_BEGINNING__LINE_NUM is null. Will be if line in redis does not match file line (New file)
    if [ -z "$EVENTS_BEGINNING__LINE_NUM" ]; then
        let num=($EVENTS_ENDING_LINE_NUM - 1)
        FILE_DATA=$(grep -Fa -B $num "[/reading] : Events" $1)
        echo $FILE_DATA

    # If not new file, find file delta
    else
        let LINE_DELTA=($EVENTS_ENDING_LINE_NUM - $EVENTS_BEGINNING__LINE_NUM)

        # LINE_DELTA will be 1 in the event the file did not update
        if [ $LINE_DELTA -eq 1 ]; then
            echo false

        # grep file delta
        else
            let num=($LINE_DELTA - 1)
            FILE_DELTA=$(grep -Fa -B $num "[/reading] : Events" $1)

            echo $FILE_DELTA
        fi
    fi

fi
