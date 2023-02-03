#!/bin/bash

# BOMB SCRIPT FOR UNDEFINED VAR OR ERR DURING EXECUTION
set -ue

# Could get null from redis line if non-existent key in redis (new file/system)
if [ "null" == "$2" ]; then # Get all blocked Event data

    EVENTS_BEGINNING_LINE_NUM=$(grep -F -na "[reading] : Events" $1 | cut -d : -f 1)
    EAL_END_LINE_NUM=$(grep -F -na "[/reading] : EALInfo" $1 | cut -d : -f 1)

    # Will resolve to "true" if file is empty. BAIL OUT!!!
    if [ -z "$EVENTS_BEGINNING_LINE_NUM" ]; then
        echo false
        exit
    fi
    EVENTS_ENDING_LINE_NUM=$(grep -F -na "[/reading] : Events" $1 | cut -d : -f 1)
    CURRENT_EVENT_LINES=$(($EVENTS_ENDING_LINE_NUM - $EVENTS_BEGINNING_LINE_NUM))

    let LINE_DELTA=($EVENTS_ENDING_LINE_NUM - $EVENTS_BEGINNING_LINE_NUM)

    FILE_DATA=$(grep -Fa -B "$LINE_DELTA" "[/reading] : Events" $1)

    echo $FILE_DATA "new_events_line_count: "$CURRENT_EVENT_LINES "new_eal_end_line_num: "$EAL_END_LINE_NUM

    exit

else

    EAL_END_LINE_NUM=$(grep -F -na "[/reading] : EALInfo" $1 | cut -d : -f 1)
    PREV_EAL_LINE_END=$2

    EVENTS_BEGINNING_LINE_NUM=$(grep -F -na "[reading] : Events" $1 | cut -d : -f 1)
    EVENTS_ENDING_LINE_NUM=$(grep -F -na "[/reading] : Events" $1 | cut -d : -f 1)
    PREV_EVENTS_LINE_END=$3
    CURRENT_EVENT_LINES=$(($EVENTS_ENDING_LINE_NUM - $EVENTS_BEGINNING_LINE_NUM))

    EAL_LINES_ADDED=$(($EAL_END_LINE_NUM - $PREV_EAL_LINE_END))
    EVENTS_LINES_ADDED=$(($CURRENT_EVENT_LINES - $PREV_EVENTS_LINE_END))

    if [ $EVENTS_LINES_ADDED -eq 0 ]; then
        echo "false"
        exit
    fi

    if [ $EVENTS_LINES_ADDED -gt 0 ]; then

        if [ $EAL_LINES_ADDED -gt 0 ]; then
            FILE_DATA=$(grep -Fa -B "$EVENTS_LINES_ADDED" "[/reading] : Events" $1)
            echo $FILE_DATA "new_events_line_count: "$CURRENT_EVENT_LINES "new_eal_end_line_num: "$EAL_END_LINE_NUM
            exit
        fi

        # EALInfo lines not added, but Events lines added
        if [ $EAL_LINES_ADDED -eq 0 ]; then

            FILE_DATA=$(grep -Fa -B "$EVENTS_LINES_ADDED" "[/reading] : Events" $1)

            echo $FILE_DATA "new_events_line_count: "$CURRENT_EVENT_LINES "new_eal_end_line_num: "$EAL_END_LINE_NUM
            exit
        fi
        echo "PARSE IT DUDE"
        exit
    fi

    # Case will run if current end postion is less than redis saved position. File has rotated
    if [ $EVENTS_LINES_ADDED -lt 0 ]; then
        # Number of lines between Events start and end blocks
        let LINE_DELTA=($EVENTS_ENDING_LINE_NUM - $EVENTS_BEGINNING_LINE_NUM)

        FILE_DATA=$(grep -Fa -B "$LINE_DELTA" "[/reading] : Events" $1)

        echo $FILE_DATA "new_events_line_count: "$CURRENT_EVENT_LINES "new_eal_end_line_num: "$EAL_END_LINE_NUM
        exit
    fi
    
fi
