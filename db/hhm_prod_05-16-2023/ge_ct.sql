UPDATE systems
SET hhm_config = '{"file_path": "/opt/hhm-files/C0051/SHIP098/SME12444", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_GECT1.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME12444';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME12446/hhm", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_GE-OPTIMA64.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME12446';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME12450/hhm", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_ct_eso.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME12450';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME12445/hhm", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_OCONEE_GE_CT64.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME12445';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME12451/hhm", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_CTSEN.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME12451';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME12412/hhm", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_gect1.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME12412';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME12413/hhm", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_GEOPT660CT1.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME12413';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME12443/hhm", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_CT_GE_BEH_2.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME12443';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME00896/hhm", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_RDMCOPCT.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME00896';

UPDATE systems -- OLD PATH
SET hhm_config = '{"file_path": "/opt/hhm-files/C0137/SHIP016/SME01091", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_RDMCCT_2.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}, {"query": "gesys", "file_name": "gesys_RE36A1600120YC.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}, {"query": "gesys", "file_name": "gesys_ct99.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME01091';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME00847/hhm", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_ct99.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}, {"query": "gesys", "file_name": "gesys_mcvct.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME00847';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME01076/hhm", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_rtct.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME01076';

UPDATE systems -- OLD PATH
SET hhm_config = '{"file_path": "/opt/hhm-files/C027932/SHIP013/SME01430", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_GRDCT02.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME01430';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME01429/hhm", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_CRDCT01.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}, {"query": "gesys", "file_name": "gesys_ct99.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME01429';

UPDATE systems -- OLD PATH
SET hhm_config = '{"file_path": "/opt/hhm-files/C027932/SHIP03/SME01431", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_LRDCT01.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME01431';

UPDATE systems -- OLD PATH
SET hhm_config = '{"file_path": "/opt/hhm-files/C027932/SHIP03/SME01432", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_LRDCT02.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME01432';

UPDATE systems -- OLD PATH
SET hhm_config = '{"file_path": "/opt/hhm-files/C027932/SHIP04/SME01433", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_HRDCT01.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME01433';

UPDATE systems -- OLD PATH
SET hhm_config = '{"file_path": "/opt/hhm-files/C027932/SHIP05/SME01434", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_BRDCT01.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME01434';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME01176/hhm", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys__oc0.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME01176';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME10071/hhm", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_SCEC_CT.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}, {"query": "gesys", "file_name": "gesys_SCSA_CT.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}, {"query": "gesys", "file_name": "gesys_schct01.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME10071';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME01435/hhm", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_BRDCT01.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME01435';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME00897/hhm", "modality": "CT", "log_rotation": "v_2", "run_group": 1}',
hhm_file_config = '[{"query": "gesys", "file_name": "gesys_rdmcct_1.log", "pg_table": "ge_ct_gesys", "parsers": ["block", "sub_block"]}]'
WHERE id = 'SME00897';