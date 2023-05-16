# Hospital Host Machine - Read Parse & Persist

## Table of Contents
### [Overview](#overview)
### [Jobs](#jobs)
   ### [GE](#ge)

## Overview

On boot, the app gets system data from the database. The app consumes hhm_config and hhm_file_config to direct the system through the app.

### On Boot

1. Boot
    * Init: receives process argument (CT, CV, MRI, phil_cv_hr_24...) to query database for relevant systems.
    * Broken down by modality or data acquisition frequency e.g. phil_cv_hr_24
    * Passes the array of systems off to determineManufacturer() 

2. Determine Manufacturer
    * Splits the systems rpp process by manufacturer
    * MRI goes to /jobs/mri ect.

## JOBS

* Jobs are broken down by manufacturer
* Each manufacturer job is then broken down by modality

### GE

#### - CT

* Runs gesys_parser()

     #### Data Acquisition
    1. Previous file size that was cached in Redis is grabbed as well as current file size
        * If there is a non-negative delta, only new file data is procured
        * If Redis returns null (no previous entry) or the delta is a negative value, the entire file is processed
        * If delta is 0, there is no new data in the file and the files last mode datetime is logged

     #### Parsing/Date Processing
    2. Parsing begins
        * The RegEx used is determined by the system's file within the hhm_file_config array
        * Within parsing, datetime processing is performed and a Luxon host_datetime is added to each match group
        * Within parsing, logfile_metadata is extracted from each relevant match group

     #### Post Processing
    3. Schema homogenization
        * Post parse, data is organized based on schema. Is an array of objects at this point
            * Currently only one schema for GE CT. If more are required, will need to store schema referance in hhm_file_config - 4/18/23
        * Form array of objects into a 2D array for bulk query
        
     #### Persist
    4. Run bulkInsert()
        * Is fed query parameterized query schema from the file's config query property
            * Bulk query determined by manufacturer, modality, and value of query property


### Phil MRI Onboarding New Mag Data
* Steps to bring new Phil MRI Mag Data column online
    1. In the 'insert_display_data' file, set condition on line 29 to true
        * FROM: if (has_prev_data.rowCount === 0 || hours_diff >= 48) {...}
        * TO: if (true || hours_diff >= 48) {...}
        * This will run entire file and aggregate by day
    2. Delete Redis reference to file cache is exists.
        * EX: del SME15802.monitor_magnet_pressure.dat
    3. Alter hhm_file_config to only contain the new file and update config.
    4. After running app manually for that system, bring hhm_file_config to original state plus new file
