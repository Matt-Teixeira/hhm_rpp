UPDATE systems
SET hhm_config = '{"file_path": "/opt/hhm-files/C0051/SHIP003/SME02524", "modality": "MRI", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_mr2-ow0.log", "pg_table": "ge_mri_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME02524';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/hhm-files/C0051/SHIP104/SME12424", "modality": "MRI", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_gemr1.log", "pg_table": "ge_mri_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME12424';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/hhm-files/C0137/SHIP001/SME01123", "modality": "MRI", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_PCNMR001.log", "pg_table": "ge_mri_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME01123';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/hhm-files/C0137/SHIP005/SME01096", "modality": "MRI", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_PARMR002.log", "pg_table": "ge_mri_gesys", "parsers": ["block", "sub_block"]}, {"query": "gesys", "file_name": "gesys_mroc.log", "pg_table": "ge_mri_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME01096';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/hhm-files/C027932/SHIP013/SME01422", "modality": "MRI", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_GRDMR01.log", "pg_table": "ge_mri_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME01422';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/hhm-files/C0051/SHIP054/SME02583", "modality": "MRI", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_DVMR.log", "pg_table": "ge_mri_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME02583'; 