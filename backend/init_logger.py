import logging.config

logging.config.fileConfig("log.ini", disable_existing_loggers=True)

logger_info = logging.getLogger()
logger_error = logging.getLogger("error")
